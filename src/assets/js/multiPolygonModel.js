export const Polygon = function (latlngArr = [], id = '') {
  this.id = id
  this.latlngArr = latlngArr
}

Polygon.prototype.addVertex = function (lat = 0, lng = 0) {
  this.latlngArr.push([lat, lng])
}

Polygon.prototype.filter = function (filterF) {
  return new Polygon(
    this.latlngArr.filter(latlng => filterF(latlng[0], latlng[1])), this.id
  )
}

Polygon.prototype.clone = function () {
  return new Polygon(this.latlngArr.slice(), this.id)
}

Polygon.prototype.getLatlngs = function () { return this.latlngArr }
Polygon.prototype.toString = function () { return JSON.stringify(this.latlngArr) }

export const MultiPolygon = function (PolygonArr = []) {
  this.polygonArr = PolygonArr
}

MultiPolygon.prototype.filter = function (filterF) {
  return new MultiPolygon(this.polygonArr.filter(polygon => filterF(polygon)))
}

MultiPolygon.prototype.findPolygonByID = function (id) {
  let res = this.polygonArr.filter(polygon => polygon.id === id)
  return res.length > 0 ? res[0] : null
}

MultiPolygon.prototype.findPolygonByIndex = function (index) {
  return this.polygonArr.length > index ? this.polygonArr[index] : null
}

MultiPolygon.prototype.addPolygon = function (polygon) {
  if (!polygon) throw new Error('Null argument found')
  this.polygonArr.push(polygon)
}

MultiPolygon.prototype.removePolygon = function (polygonID = '') {
  this.polygonArr = this.filter(polygon => polygon.id !== polygonID)
}

MultiPolygon.prototype.buildFromGeoJSON = function (GeoJSON) {
  let multipoly = new MultiPolygon()
  if (GeoJSON) {
    let polygons = GeoJSON.coordinates
    for (let c = 0; c < polygons.length; c++) {
      // geoJSON usa [longitude, latitude] mentre leaflet usa [latitude, longitude]
      // occorre fare lo scambio
      let swapped = polygons[c][0].map(el => [el[1], el[0]])
      multipoly.addPolygon(new Polygon(swapped, c))
    }
  }
  return multipoly
}
