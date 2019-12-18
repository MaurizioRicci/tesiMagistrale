<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <LoginWarning/>
        <b-alert variant="warning" :show="beneOverlapTxt !== ''">{{beneOverlapTxt}}</b-alert>
        <b-alert variant="success" :show="serverRespOk">Bene creato/aggiunto</b-alert>
        <h2 v-if="!noTitle">{{title || 'Aggiungi/Modifica un bene'}}</h2>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <transition name="slide-fade" v-on:leave="mapCols = 12">
        <!-- 12-mapCols > 0 => se la mappa occupa 12 colonne allora il form è nascosto -->
        <b-col cols="8" v-show="12-mapCols > 0">

          <BeneFormAddEdit ref="form_bene" v-model="form"
            :validated="sendBtnClicked"/>
          <b-button variant="primary" @click="goBack">Indietro</b-button>
          <b-button type="reset" variant="danger" v-on:click="onReset">Reset</b-button>
          <b-button type="submit" variant="primary"
            @click="evt => {leavePage = true; onSubmit(evt)}">Invia</b-button>
          <b-button v-if="!editMode" type="submit" variant="primary"
            @click="evt => {leavePage = false; onSubmit(evt)}">Invia e acquisisci altro bene</b-button>

        </b-col>
      </transition>
      <b-col :cols="mapCols">
        <MyMap ref="myMap" @ingrandisci-mappa="ingrandisciMappa"
          v-model="form.polygon" :zoom="editMode ? 17 : 10" :center="mapCenter"
          @rimpicciolisci-mappa="rimpicciolisciMappa"
          v-on-clickaway="checkPolygonDist"/>
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
import '@/assets/css/slideFadeTransition.css'
import lodashclonedeep from 'lodash.clonedeep'
import { mixin as clickaway } from 'vue-clickaway'
const axios = require('axios')
const qs = require('qs')

// Aggiunge o Modifica un bene esistente
export default {
  name: 'AggiungiModificaBene',
  components: {
    Menu,
    LoginWarning,
    BeneFormAddEdit,
    MyMap
  },
  mixins: [commonPageMixin, dettagliBeneMixin, clickaway],
  data () {
    return {
      mapCols: 4,
      sendBtnClicked: false,
      serverRespOk: false, // serve per innescare il messaggio di bene creato/modificato,
      leavePage: true, // decide se lasciare la pagina dopo aggiunta/modifica o se rimanere,
      beneOverlapTxt: '' // mostra gli eventuali beni sovrapposti a quello che si sta creando
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
          ['Attenzione', 'Non hai finito di compilare i campi richiesti.'])
      }
    },
    // @vuese
    // invio effettivo dei dati al server. form ok & utente è sicuro di quello che fa
    sendData () {
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
          // poi se va tutto bene bisogna incrementare l'id dell'ultimo bene usato
          this.$store.commit('incrementaBeneUltimoID')
          this.$vueEventBus.$emit('master-page-show-msg', ['Risposta', 'Ok'])
          if (this.leavePage) {
            this.$vueEventBus.$once('master-page-show-msg-ok',
              () => this.goBack())
          } else { this.init() }
        }, fail => {
          this.$vueEventBus.$emit('master-page-show-msg', ['Errore', fail.response.data.msg])
        })
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
      this.sendBtnClicked = false
      this.serverRespOk = false
      this.leavePage = true
      this.beneOverlapTxt = ''
      if (!this.editMode) {
      // se non si modifica allora si aggiunge e quindi diamo noi l'id del bene da creare
        this.form.id = this.$store.getters.beneUltimoID + 1
      }
      if (this.idBene && this.editMode) {
        this.fetchBeneDataByID(this.idBene, this.idUtente)
      }
    },
    checkPolygonDist () {
      let postData = lodashclonedeep(
        Object.assign({}, this.form, this.$store.getters.getUserData))
      // PostGIS vuole i punti come longitudine-latitudine
      postData.polygon = postData.polygon.flipCoordinates()
      axios.post(this.$store.getters.checkDistURL, qs.stringify(postData))
        .then(resp => {
          if (resp.data.length > 0) {
            this.beneOverlapTxt = 'Il bene è molto vicino ai seguenti beni:'
            let infoArr = resp.data.map(el => {
              let dist = Math.floor(Number(el.dist))
              return 'ID=' + el.id + ' (' + dist + 'm)'
            })
            this.beneOverlapTxt += infoArr.join(', ')
          }
        })
    }
  },
  mounted () {
    // metterer tutto dentro init poichè non si può invocare nuovamente mounted
    this.init()
  },
  watch: {
    $route (to, from) {
      this.resetData()
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
</style>
