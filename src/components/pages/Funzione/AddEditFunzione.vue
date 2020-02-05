<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <LoadingOverlay ref="loadingOverlay"/>
        <h2 v-if="!noTitle">{{title || 'Aggiungi/Modifica una funzione'}}</h2>
        <LoginWarning/>
        <b-alert show v-if="form.msg_validatore" variant="primary">
          Da rivedere: {{form.msg_validatore}}
        </b-alert>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <transition name="slide-fade" v-on:leave="mapCols = 12">
        <!-- 12-mapCols > 0 => se la mappa occupa 12 colonne allora il form è nascosto -->
        <b-col cols="8" v-show="12-mapCols > 0">

          <FunzioneCopiaIncolla :funzioneModel="form"/>

          <FunzioneFormAddEdit ref="form_funzione" v-model="form"
            :validated="sendBtnClicked"/>
          <b-button variant="primary" @click="goBack">Indietro</b-button>
          <b-button type="reset" variant="danger" v-on:click="onReset">Reset</b-button>
          <b-button type="submit" variant="primary"
            @click="evt => {leavePage = true; onSubmit(evt)}">Salva</b-button>
          <b-button v-if="!editMode" type="submit" variant="primary"
            @click="evt => {leavePage = false; onSubmit(evt)}">Salva e acquisisci altra funzione</b-button>

        </b-col>
      </transition>
      <b-col :cols="mapCols">
        <MyMap ref="myMap" locked @ingrandisci-mappa="ingrandisciMappa"
          v-model="form.polygon" :zoom="editMode ? 17 : 10" :center="mapCenter"
          @rimpicciolisci-mappa="rimpicciolisciMappa"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" class="mt-2" v-if="!sonoRevisore">
        <hr>
        <BeniUtente cercaInArchivioTemp
        caption="Questa tabella contiene i tuoi beni da approvare."/>
      </b-col>
      <b-col cols="12">
        <hr>
        <RicercaBeniApprovati/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import dettagliFunzioneMixin from '@/components/mixins/DettagliFunzione'
import FunzioneFormAddEdit from '@/components/ui/FunzioneFormAddEdit'
import Menu from '@/components/ui/Menu'
import LoginWarning from '@/components/ui/LoginWarning'
import MyMap from '@/components/ui/Map'
import '@/assets/styles/slideFadeTransition.css'
import RicercaBeniApprovati from '@/components/ui/RicercaBeniApprovati'
import BeniUtente from '@/components/ui/BeniUtente'
import FunzioneCopiaIncolla from '@/components/ui/FunzioneCopyPaste'
import LoadingOverlay from '@/components/ui/LoadingOverlay'
import lodashclonedeep from 'lodash.clonedeep'
import { ternaVera } from '@/assets/js/date/dateF'
import axios from 'axios'
import qs from 'qs'

// Aggiunge o Modifica una funzione esistente
export default {
  name: 'AggiungiModificaFunzione',
  components: {
    Menu,
    LoginWarning,
    FunzioneFormAddEdit,
    MyMap,
    RicercaBeniApprovati,
    BeniUtente,
    FunzioneCopiaIncolla,
    LoadingOverlay
  },
  mixins: [commonPageMixin, dettagliFunzioneMixin],
  computed: {
    ternaValida () {
      return ternaVera(this.form.data_ante, this.form.data_poste, this.form.tipodata)
    },
    sonoRevisore () { return this.$store.getters.getUserData.role === 'revisore' }
  },
  data () {
    return {
      mapCols: 4,
      sendBtnClicked: false,
      // registra se il server ha risposto positivamente alla aggiunta/modifica
      serverRespOk: false,
      // decide se lasciare la pagina dopo aggiunta/modifica o se rimanere
      leavePage: true
    }
  },
  props: {
    // se vero modifica la funzione, altrimenti aggiunge una nuova funzione
    editMode: Boolean
  },
  methods: {
    // @vuese
    // quando l'utente preme reset. Se modifica una funzione torna ai dettagli originali.
    // Se aggiunge una funzione pulisce tutti i campi
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
      if (!this.ternaValida) {
        this.$vueEventBus.$emit('master-page-show-msg',
          ['Attenzione', 'Data anteriore, data posteriore e tipo data non tornano tra loro.'])
      } else {
        if (this.$refs.form_funzione.checkValidity()) {
          this.sendData()
        } else {
        // mostra un messaggio in un modal con un certo titolo e testo
          this.$vueEventBus.$emit('master-page-show-msg',
            ['Attenzione', 'Ci sono errori nel form.'])
        }
      }
    },
    // @vuese
    // invio effettivo dei dati al server. form ok & utente è sicuro di quello che fa
    sendData () {
      // mostro la schermata di caricamento
      this.$refs.loadingOverlay.show()
      let postData = lodashclonedeep(
        Object.assign({}, this.form, this.$store.getters.getUserData))
      let storeGetters = this.$store.getters
      // la url dipende se modifico un bene o se ne aggiungo uno
      let url = this.editMode ? storeGetters.modificaFunzioneURL : storeGetters.aggiungiFunzioneURL
      axios.post(url, qs.stringify(postData))
        .then(ok => {
          this.serverRespOk = true
          this.$vueEventBus.$emit('master-page-show-msg',
            ['Risposta', 'Funzione salvata', 'sendData'])
          const callback = this.leavePage ? () => this.goBack() : () => this.init()
          this.$vueEventBus.$once('master-page-show-msg-ok-sendData',
            callback)
        }, error => {
          let msg = (error.response && error.response.data.msg) || error.message
          this.$vueEventBus.$emit('master-page-show-msg', ['Errore', msg])
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
      if (this.idFunzione && this.editMode) {
        this.fetchFunzioneDataByID(this.idFunzione, this.idUtente, this.cercaInArchivioTemp)
      }
    }
  },
  mounted () {
    // metterer tutto dentro init poichè non si può invocare nuovamente mounted
    this.init()
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
    if (!this.serverRespOk) {
      // se il server non ha dato responso OK o se proprio non gli è stato mandato
    // devo escludere il campo id dal confronto poichè è sicuramente diverso da
    // quello restituito dal server dato che non c'è proprio
      let formClone = Object.assign({}, this.form)
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
hr { margin: 5px; }
</style>
