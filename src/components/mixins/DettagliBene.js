import {MultiPolygon} from '@/assets/js/Models/multiPolygonModel'
import getModelloBene from '@/assets/js/Models/beneModel'
const axios = require('axios')

// define a mixin object
export default {
  data () {
    return {
      form: getModelloBene(),
      mapCenter: null
    }
  },
  methods: {
    getModel () {
      return getModelloBene()
    },
    // Restituisce una promessa in ogni caso, il valore dipende:
    // null se non viene eseguita la richiesta o se non va a buon fine
    // I dettagli del bene se la richiesta va a buon fine
    fetchDataByID (requiredID) {
      const T = this
      if (!requiredID) return Promise.resolve()
      // fare richiesta dati del bene con id nella url
      return axios.get(this.$store.getters.dettagliBeneURL, {
        params: { 'id': requiredID, 'tmp_db': this.cercaInRevisione }
      }).then(ok => {
        this.form = this.getModel()
        if (ok.data.length <= 0) {
          this.$vueEventBus.$emit('master-page-show-error', ['Info', 'No result found'])
        } else {
          // T.form = ok.data
          let geojson = ok.data.geojson
          // T.form.polygon
          let newPolygon = new MultiPolygon()
            .buildFromGeoJSON(geojson).findPolygonByIndex(0)

          T.mapCenter = ok.data.centroid.coordinates
          // geoJSON usa [longitude, latitude] mentre leaflet usa [latitude, longitude]
          // occorre fare lo scambio
          T.mapCenter = [T.mapCenter[1], T.mapCenter[0]]
          // T.$set(T.form, 'polygon', newPolygon)
          for (let k in T.form) {
            T.form[k] = ok.data[k]
          }
          T.form.polygon = newPolygon
          return T.form
        }
      }).catch(error => {
        let msg = (error.response && error.response.data.msg) || error.message
        this.$vueEventBus.$emit('master-page-show-error', ['Error', msg])
      })
    }
  }
}
