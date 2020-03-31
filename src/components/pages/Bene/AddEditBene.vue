<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <LoadingOverlay ref="loadingOverlay"/>
        <h2 v-if="!noTitle">{{title || 'Aggiungi/Modifica un bene'}}</h2>
        <LoginWarning/>
        <b-alert show v-if="form.msg_validatore" variant="primary"
          style="max-height:30vh; overflow:auto;">
          Da rivedere: {{form.msg_validatore}}
        </b-alert>
        <b-alert variant="warning" :show="beniVicini.length > 0">
          Il bene è molto vicino ai seguenti beni:
          <b-button-group class="justify-content-center" style="flex-wrap: wrap;">
            <b-button v-for="(bene,index) in beniVicini" :key="index"
              variant="light" class="btn-outline-info"
              title="Click per dettagli" v-b-modal.modal-bene-overview
              @click="$refs.beneOverview.showBeneDetails(bene.id, bene.id_utente)">
             ID {{bene.id}}{{bene.id_utente?' (temp)' : ' '}}({{ Math.round(Number(bene.dist)) }}m)
            </b-button>
          </b-button-group>
        </b-alert>
        <b-modal static id="modal-bene-overview" title="Dettagli bene" size="lg" hide-footer>
          <BeneOverview ref="beneOverview"/>
        </b-modal>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="8">

          <BeneFormAddEdit ref="form_bene" v-model="form"
            :validated="sendBtnClicked"/>
          <b-button type="button" @click="goBack">Indietro</b-button>
          <b-button type="reset" variant="danger" v-on:click="onReset">Reset</b-button>
          <b-button type="submit" variant="primary"
            @click="evt => {leavePage = true; onSubmit(evt)}">Salva</b-button>
          <b-button v-if="!editMode" type="submit" variant="primary"
            @click="evt => {leavePage = false; onSubmit(evt)}">Salva e acquisisci altro bene</b-button>

      </b-col>

      <b-col cols="4">
        <MyMap ref="myMap"
          v-model="form.polygon" :zoom="editMode ? 17 : 10" :center="mapCenter"
          @change="checkPolygonDist"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import dettagliBeneMixin from '@/components/mixins/DettagliBene'
import BeneFormAddEdit from '@/components/ui/BeneFormAddEdit'
import Menu from '@/components/ui/Menu'
import LoginWarning from '@/components/ui/LoginWarning'
import MyMap from '@/components/ui/Map'
import LoadingOverlay from '@/components/ui/LoadingOverlay'
import BeneOverview from '@/components/ui/BeneOverview'
import lodashclonedeep from 'lodash.clonedeep'
import axios from 'axios'
import qs from 'qs'

// @group Pages
// Aggiunge o Modifica un bene esistente
export default {
  name: 'AggiungiModificaBene',
  components: {
    Menu,
    LoginWarning,
    BeneFormAddEdit,
    MyMap,
    LoadingOverlay,
    BeneOverview
  },
  mixins: [commonPageMixin, dettagliBeneMixin],
  data () {
    return {
      sendBtnClicked: false,
      // registra se il server ha risposto positivamente alla aggiunta/modifica
      serverRespOk: false,
      // decide se lasciare la pagina dopo aggiunta/modifica o se rimanere
      leavePage: true,
      // array di eventuali beni sovrapposti a quello che si sta creando
      beniVicini: []
    }
  },
  props: {
    // se vero modifica il bene, altrimenti aggiunge un nuovo bene
    editMode: Boolean
  },
  methods: {
    // @vuese
    // quando l'utente preme reset. Se modifica un bene torna ai dettagli originali.
    // Se aggiunge un bene pulisce tutti i campi
    onReset (evt) {
      evt.preventDefault()
      this.init()
    },
    // @vuese
    // quando si preme invio sul form
    onSubmit (evt) {
      // serve a innescare la validazione del form. Vedi <form...> a inizio
      this.sendBtnClicked = true
      evt.preventDefault()
      if (this.$refs.form_bene.checkValidity()) {
        this.sendData()
      } else {
        // mostra un messaggio in un modal con un certo titolo e testo
        this.$vueEventBus.$emit('master-page-show-msg',
          ['Attenzione', 'Ci sono errori nel form.'])
      }
    },
    // @vuese
    // invio effettivo dei dati al server. form ok & utente è sicuro di quello che fa
    sendData () {
      // mostro la schermata di caricamento
      this.$refs.loadingOverlay.show()
      let postData = lodashclonedeep(
        Object.assign({}, this.form, this.$store.getters.getUserData))
      // PostGIS vuole i punti come longitudine-latitudine
      postData.polygon = postData.polygon.flipCoordinates()
      let storeGetters = this.$store.getters
      // la url dipende se modifico un bene o se ne aggiungo uno
      let url = this.editMode ? storeGetters.modificaBeneURL : storeGetters.aggiungiBeneURL
      axios.post(url, qs.stringify(postData))
        .then(ok => {
          this.serverRespOk = true
          this.$vueEventBus.$emit('master-page-show-msg',
            ['Risposta', 'Bene salvato', 'sendData'])
          const callback = this.leavePage ? () => this.goBack() : () => this.init()
          this.$vueEventBus.$once('master-page-show-msg-ok-sendData',
            callback)
        })
        // nascondo la schermata di caricamento
        .finally(() => this.$refs.loadingOverlay.hide())
    },
    ingrandisciMappa () {
      this.mapCols = 12
      this.$nextTick(() => this.$refs.myMap.invalidateSize())
    },
    rimpicciolisciMappa () {
      this.mapCols = 4
      this.$nextTick(() => this.$refs.myMap.invalidateSize())
    },
    init () {
      // reset variabili
      this.resetData()
      this.sendBtnClicked = false
      this.serverRespOk = false
      this.leavePage = true
      this.beniVicini = []
      if (!this.editMode) {
        // se non si modifica allora si aggiunge e quindi diamo noi l'id del bene da creare
        // chiudo tutti i buchi di id di un certo utente
        let storeGetters = this.$store.getters
        return axios.post(storeGetters.getNewIDURL, qs.stringify(storeGetters.getUserData))
          .then(resp => {
            let id = resp.data.id
            this.formRetrived.id = id
            this.form.id = id
          })
      } else if (this.idBene && this.editMode) {
        return this.fetchBeneDataByID(this.idBene, this.idUtente, this.cercaInArchivioTemp)
      }
    },
    checkPolygonDist () {
      // controllo la distanza da altri beni
      let postData = lodashclonedeep(
        Object.assign({}, this.form, this.$store.getters.getUserData))
      // PostGIS vuole i punti come longitudine-latitudine
      postData.polygon = postData.polygon.flipCoordinates()
      axios.post(this.$store.getters.checkDistURL, qs.stringify(postData))
        .then(resp => { this.beniVicini = resp.data || [] })
    }
  },
  mounted () {
    // mettere l'inizializzazione dentro init poichè non si può invocare nuovamente mounted
    // controllo la distanza tra la geometria data e quella nei vari archivi
    this.init().then(() => this.checkPolygonDist())
  },
  watch: {
    $route (to, from) {
      this.init()
    }
  },
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    let resp = true
    // devo escludere il campo id dal confronto poichè è sicuramente diverso da
    // quello restituito dal server dato che non c'è proprio
    if (!this.serverRespOk) {
      // se il server non ha dato responso OK o se proprio non gli è stato mandato
      let formClone = lodashclonedeep(this.form)
      formClone.id = this.formRetrived.id
      if (JSON.stringify(formClone) !== JSON.stringify(this.formRetrived)) {
        resp = window.confirm('Hai modifiche in sospeso, abbandonare la pagina?')
      }
    }
    if (resp) next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
