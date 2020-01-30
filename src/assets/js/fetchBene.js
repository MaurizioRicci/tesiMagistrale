import { Polygon, MultiPolygon } from '@/assets/js/Models/multiPolygonModel'
import getModelloBene from '@/assets/js/Models/beneModel'
import lodashclonedeep from 'lodash.clonedeep'
const axios = require('axios')
const qs = require('qs')

export default function fetchBene (This, URLdata) {
  let URL = This.$store.getters.dettagliBeneURL
  let data = { form: getModelloBene(),
    formRetrived: getModelloBene(),
    mapCenter: This.$store.getters.getDefaultMapCenter }
  return axios.post(URL, qs.stringify(URLdata))
    .then(ok => {
      if (ok.data.length <= 0) {
        return null
        // this.$vueEventBus.$emit('master-page-show-msg', ['Info', 'No result found'])
      } else {
        let geojson = ok.data.geojson
        let newPolygon = new MultiPolygon()
          .buildFromGeoJSON(geojson).findPolygonByIndex(0)
        newPolygon = newPolygon || new Polygon()
        let centroid = ok.data.centroid
        if (centroid) {
          data.mapCenter = centroid.coordinates
          // geoJSON usa [longitude, latitude] mentre leaflet usa [latitude, longitude]
          // occorre fare lo scambio
          data.mapCenter = [data.mapCenter[1], data.mapCenter[0]]
        }
        for (let k in data.form) {
          if (typeof ok.data[k] !== 'undefined' &&
          ok.data[k] !== '') {
            data.form[k] = ok.data[k]
          }
        }
        data.form.polygon = newPolygon
        // faccio una deep copy dei valori resi dal server
        // salvo cosi due copie: originale e versione modificabile da utente
        data.formRetrived = lodashclonedeep(data.form)
        return data
      }
    })
}
