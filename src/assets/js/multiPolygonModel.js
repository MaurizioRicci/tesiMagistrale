const Polygon = function (latlngArr = [], id = '') {
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

Polygon.prototype.toString = function () {
  let str = this.id + ': '
  this.latlngArr.forEach(el => { str += el })
  return str
}

Polygon.prototype.toArray = function () { return this.latlngArr }
Polygon[Symbol.iterator] = function () { return this.latlngArr[Symbol.iterator]() }

const MultiPolygon = function (PolygonArr = []) {
  this.polygonArr = PolygonArr
}

MultiPolygon.prototype.filter = function (filterF) {
  return new MultiPolygon(this.polygonArr.filter(polygon => filterF(polygon)))
}

MultiPolygon.prototype.findPolygon = function (id) {
  let res = this.filter(polygon => polygon.id === id)
  return res.length > 0 ? res[0] : null
}

MultiPolygon.prototype.addPolygon = function (polygon) {
  if (!polygon) throw new Error('Null argument found')
  this.polygonArr.push(polygon)
}

MultiPolygon.prototype.removePolygon = function (polygonID = '') {
  this.polygonArr = this.filter(polygon => polygon.id !== polygonID)
}

MultiPolygon[Symbol.iterator] = function () { return this.polygonArr[Symbol.iterator]() }

export { Polygon, MultiPolygon }
