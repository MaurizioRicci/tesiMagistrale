import {MultiPolygon} from '@/assets/js/Models/multiPolygonModel'
// statusBene è usato in AddEditBene, non cancellare
// eslint-disable-next-line no-unused-vars
import getModelloBene, {statusBene} from '@/assets/js/Models/beneModel'
import lodashclonedeep from 'lodash.clonedeep'
const axios = require('axios')

// define a mixin object
export default {
  data () {
    return {
      // form con dati modificabili da utente
      form: getModelloBene(),
      // form con i dati originali del server sul bene
      formRetrived: getModelloBene(),
      // valore di default per la mappa
      mapCenter: [43.7086433, 10.3891619]
    }
  },
  props: {
    // specifica l'id del bene da visualizzare
    idBene: String,
    // specifica l'id utente del proprietario del bene in archivio temporaneo
    idUtente: String,
    // se cercare l'id in archivio temporaneo. Default: archivio definitivo
    cercaInRevisione: Boolean
  },
  methods: {
    getModel () {
      return getModelloBene()
    },
    // @vuese
    // Restituisce una promessa in ogni caso, il valore dipende:
    // null se non viene eseguita la richiesta o se non va a buon fine
    // I dettagli del bene se la richiesta va a buon fine
    fetchDataByID (requiredID, idUtente) {
      if (this.cercaInRevisione && typeof idUtente === 'undefined') {
        throw new Error('Per cercare un bene in archivio temporaneo serve anche id utente')
      }

      const T = this
      if (!requiredID) return Promise.resolve()
      // fare richiesta dati del bene con id nella url
      return axios.get(this.$store.getters.dettagliBeneURL, {
        params: { 'id': requiredID,
          'id_utente': idUtente,
          'tmp_db': this.cercaInRevisione }
      }).then(ok => {
        this.form = this.getModel()
        if (ok.data.length <= 0) {
          this.$vueEventBus.$emit('master-page-show-msg', ['Info', 'No result found'])
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
          // faccio una deep copy dei valori resi dal server
          // salvo cosi due copie: originale e versione modificabile da utente
          T.formRetrived = lodashclonedeep(T.form)
          return T.form
        }
      }).catch(error => {
        // se è presente un messaggio di risposta dal server uso quello
        // altrimenti viene usato un messaggio di axios relativo al codice d'errore
        let msg = (error.response && error.response.data.msg) || error.message
        this.$vueEventBus.$emit('master-page-show-msg', ['Errore', msg])
      })
    }
  }
}
