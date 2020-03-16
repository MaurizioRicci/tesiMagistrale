import getModelloBene from '@/assets/js/Models/beneModel'
import fetchBene from '@/assets/js/fetchBene'

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
    // le proprietà servono per essere passate al componente che le usa
    // il singolo componente poi può scegliere se usarle o meno. Infatti
    // fetchBeneDataByID prende dei generici parametri
    // specifica l'id del bene da visualizzare
    idBene: String,
    // specifica l'id utente del proprietario del bene in archivio temporaneo
    idUtente: String,
    // se cercare l'id in archivio temporaneo. Default: archivio definitivo
    cercaInArchivioTemp: Boolean
  },
  methods: {
    resetData () {
      // dettaglio del bene
      this.form = getModelloBene()
      // dettaglio del bene cosi come scaricato dal server
      this.formRetrived = getModelloBene()
      // centroide del bene
      this.mapCenter = this.$store.getters.getDefaultMapCenter
    },
    getModel () {
      return getModelloBene()
    },
    // @vuese
    // Restituisce una promessa in ogni caso.
    // I dettagli del bene sono salvati in form & formRetrived & mapCenter se la richiesta va a buon fine
    fetchBeneDataByID (requiredID, idUtente, cercaInArchivioTemp, options = {}) {
      let { noResultsMsg } = options
      if (cercaInArchivioTemp && !idUtente) {
        throw new Error('Per cercare un bene in archivio temporaneo serve anche id utente')
      }
      if (!cercaInArchivioTemp && idUtente) {
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
      // se fetchBene ha un errore non fa niente perchè .then non viene eseguito
      return fetchBene(this, postData)
        .then(data => {
          if (!data) {
            this.$vueEventBus.$emit('master-page-show-msg', ['Info', noResultsMsg || 'Nessun risultato trovato'])
          } else {
            T.mapCenter = data.mapCenter
            T.form = data.form
            T.formRetrived = data.formRetrived
            return T.form
          }
        })
    }
  }
}
