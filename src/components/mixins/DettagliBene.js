import {MultiPolygon} from '@/assets/js/Models/multiPolygonModel'
// statusBene è usato in AddEditBene, non cancellare
// eslint-disable-next-line no-unused-vars
import getModelloBene, {statusBene} from '@/assets/js/Models/beneModel'
import lodashclonedeep from 'lodash.clonedeep'
import { Polygon } from '../../assets/js/Models/multiPolygonModel'
const axios = require('axios')
const qs = require('qs')

// define a mixin object
export default {
  data () {
    return {
      // form con dati modificabili da utente
      form: getModelloBene(),
      // form con i dati originali del server sul bene
      formRetrived: getModelloBene(),
      // valore di default per la mappa
      mapCenter: this.$store.getters.getDefaultMapCenter
    }
  },
  props: {
    // specifica l'id del bene da visualizzare
    idBene: String,
    // specifica l'id utente del proprietario del bene in archivio temporaneo
    idUtente: String,
    // se cercare l'id in archivio temporaneo. Default: archivio definitivo
    cercaInArchivioTemp: Boolean
  },
  methods: {
    resetData () {
      this.form = getModelloBene()
      this.formRetrived = getModelloBene()
      this.mapCenter = this.$store.getters.getDefaultMapCenter
    },
    getModel () {
      return getModelloBene()
    },
    // @vuese
    // Restituisce una promessa in ogni caso, il valore dipende:
    // null se non viene eseguita la richiesta o il valore d'errore non va a buon fine
    // I dettagli del bene se la richiesta va a buon fine
    fetchDataByID (requiredID, idUtente) {
      if (this.cercaInArchivioTemp && typeof idUtente === 'undefined') {
        throw new Error('Per cercare un bene in archivio temporaneo serve anche id utente')
      }

      const T = this
      if (!requiredID) return Promise.resolve()
      // fare richiesta dati del bene con id nella url
      let postData = {
        'id': requiredID,
        'id_utente': idUtente,
        'tmp_db': this.cercaInArchivioTemp
      }
      postData = Object.assign(postData, this.$store.getters.getUserData)
      return axios.post(this.$store.getters.dettagliBeneURL, qs.stringify(postData))
        .then(ok => {
          this.form = this.getModel()
          if (ok.data.length <= 0) {
            this.$vueEventBus.$emit('master-page-show-msg', ['Info', 'No result found'])
          } else {
          // T.form = ok.data
            let geojson = ok.data.geojson
            // T.form.polygon
            let newPolygon = new MultiPolygon()
              .buildFromGeoJSON(geojson).findPolygonByIndex(0)
            newPolygon = newPolygon || new Polygon()
            let centroid = ok.data.centroid
            if (centroid) {
              T.mapCenter = centroid.coordinates
              // geoJSON usa [longitude, latitude] mentre leaflet usa [latitude, longitude]
              // occorre fare lo scambio
              T.mapCenter = [T.mapCenter[1], T.mapCenter[0]]
            }
            // T.$set(T.form, 'polygon', newPolygon)
            for (let k in T.form) {
              if (typeof ok.data[k] !== 'undefined' &&
                ok.data[k] !== '') {
                T.form[k] = ok.data[k]
              }
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
