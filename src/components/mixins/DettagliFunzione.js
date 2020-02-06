import getModelloFunzione from '@/assets/js/Models/funzioneModel'
import fetchFunzione from '@/assets/js/fetchFunzione'

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
    // le proprietà servono per essere passate al componente che le usa
    // il singolo componente poi può scegliere se usarle o meno. Infatti
    // fetchFunzioneDataByID prende dei generici parametri
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
    fetchFunzioneDataByID (requiredID, idUtente, cercaInArchivioTemp, options = {}) {
      let { noResultsMsg } = options
      if (cercaInArchivioTemp && typeof idUtente === 'undefined') {
        throw new Error('Per cercare una funzione in archivio temporaneo serve anche id utente')
      }
      if (!cercaInArchivioTemp && typeof idUtente !== 'undefined') {
        throw new Error('Hai specificato un id utente ma non il flag per cercare in archivio temporaneo')
      }

      const T = this
      if (!requiredID) return Promise.resolve()
      // fare richiesta dati del bene con id nella url
      let postData = {
        'id': requiredID,
        'id_utente': idUtente,
        'tmp_db': cercaInArchivioTemp
      }
      postData = Object.assign(postData, this.$store.getters.getUserData)
      return fetchFunzione(this, postData)
        .then(data => {
          if (!data) {
            this.$vueEventBus.$emit('master-page-show-msg', ['Info', noResultsMsg || 'No result found'])
          } else {
            T.mapCenter = data.mapCenter
            T.form = data.form
            T.formRetrived = data.formRetrived
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
