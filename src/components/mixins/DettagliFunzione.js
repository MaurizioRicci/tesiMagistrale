import getModelloFunzione from '@/assets/js/Models/funzioneModel'
import lodashclonedeep from 'lodash.clonedeep'
const axios = require('axios')
const qs = require('qs')

// define a mixin object
export default {
  data () {
    return {
      // form con dati modificabili da utente
      form: getModelloFunzione(),
      // form con i dati originali del server sul bene
      formRetrived: getModelloFunzione(),
      // valore di default per la mappa
      mapCenter: this.$store.getters.getDefaultMapCenter
    }
  },
  props: {
    // specifica l'id della funzione da visualizzare
    idFunzione: String,
    // specifica l'id utente del proprietario della funzione in archivio temporaneo
    idUtente: String,
    // se cercare l'id in archivio temporaneo. Default: archivio definitivo
    cercaInArchivioTemp: Boolean
  },
  methods: {
    resetData () {
      this.form = getModelloFunzione()
      this.formRetrived = getModelloFunzione()
      this.mapCenter = this.$store.getters.getDefaultMapCenter
    },
    getModel () {
      return getModelloFunzione()
    },
    // @vuese
    // Restituisce una promessa in ogni caso, il valore dipende:
    // null se non viene eseguita la richiesta o il valore d'errore non va a buon fine
    // I dettagli del bene se la richiesta va a buon fine
    fetchFunzioneDataByID (requiredID, idUtente) {
      if (this.cercaInArchivioTemp && typeof idUtente === 'undefined') {
        throw new Error('Per cercare una funzione in archivio temporaneo serve anche id utente')
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
      return axios.post(this.$store.getters.dettagliFunzioneURL, qs.stringify(postData))
        .then(ok => {
          this.form = this.getModel()
          if (ok.data.length <= 0) {
            this.$vueEventBus.$emit('master-page-show-msg', ['Info', 'No result found'])
          } else {
            let centroid = ok.data.centroid
            if (centroid) {
              T.mapCenter = centroid.coordinates
              // geoJSON usa [longitude, latitude] mentre leaflet usa [latitude, longitude]
              // occorre fare lo scambio
              T.mapCenter = [T.mapCenter[1], T.mapCenter[0]]
            }
            for (let k in T.form) {
              if (typeof ok.data[k] !== 'undefined' &&
                ok.data[k] !== '') {
                T.form[k] = ok.data[k]
              }
            }
            // i due ruoli sono in JSON devo parsarli
            T.form.ruolo = ok.data.ruolo ? JSON.parse(ok.data.ruolo) : T.form.ruolo
            T.form.ruolor = ok.data.ruolor ? JSON.parse(ok.data.ruolor) : T.form.ruolor
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
