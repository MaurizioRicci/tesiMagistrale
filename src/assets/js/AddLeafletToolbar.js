import { Polygon } from '@/assets/js/Models/multiPolygonModel'
import 'leaflet-toolbar'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'

const defaultCallbacks = {
  onCreated: (geoJSON) => {},
  onEdited: (geoJSON) => {},
  onDeleted: () => {}
}

export default {
  initToolbar: function (map, callbacks, disabledToolbar) {
    const L = window.L
    callbacks = callbacks || defaultCallbacks
    this.drawnItems = L.featureGroup().addTo(map)
    this.drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polyline: false,
        polygon: disabledToolbar ? false : {
          allowIntersection: false,
          showArea: true
        },
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: this.drawnItems,
        edit: !disabledToolbar,
        remove: !disabledToolbar,
        polygon: {
          allowIntersection: false,
          showArea: true
        }
      },
      delete: {
        delete: !disabledToolbar
      }
    })
    map.addControl(this.drawControl)
    map.on(window.L.Draw.Event.CREATED, (event) => {
      var layer = event.layer
      // cancello il vecchio layer quando l'utente clicca sulla
      // toolbar per aggiungere un poligono
      this.drawnItems.clearLayers()
      this.drawnItems.addLayer(layer)
      let gJSON = layer.toGeoJSON()
      callbacks.onCreated(gJSON)
    })
    map.on(window.L.Draw.Event.EDITED, (event) => {
      var layers = event.layers
      layers.eachLayer(function (layer) {
        // salvo le nuove coordinate del poligono
        let gJSON = layer.toGeoJSON()
        callbacks.onEdited(gJSON)
      })
    })
    map.on(window.L.Draw.Event.DELETED, (event) => {
      callbacks.onDeleted()
    })
  },
  addPoly: function (newPolygon) {
    if (newPolygon && this.drawnItems) {
      if (!(newPolygon instanceof Polygon)) {
        throw new Error('addPoly: atteso poligono di classe Polygon')
      }
      const L = window.L
      this.drawnItems.clearLayers()
      if (newPolygon.getLatLngs().length > 0) {
        let polygonL = new L.Polygon(newPolygon.getLatLngs())
        this.drawnItems.addLayer(polygonL)
      }
    }
  }
}
