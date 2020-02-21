<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <h2 v-if="!noTitle">{{title || 'Valida un bene'}}</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4>Bene in archivio definitivo</h4>
        <BeneFormView :form="formBeneArchDef" :disallowIDChange="true"/>
        <MyMap ref="myMap1" locked :zoom="17" :controls="mapControls"
            v-model="formBeneArchDef.polygon" :center="mapCenterArchDef"/>
      </b-col>
      <b-col>
        <h4>Bene da approvare</h4>
        <BeneFormAddEdit ref="form_bene" v-model="form" no-draft
            :validated="sendBtnClicked"/>
        <MyMap ref="myMap2" v-model="form.polygon"
            :controls="mapControls"
            :zoom="17" :center="mapCenter"/>
      </b-col>
    </b-row>
    <b-row align-h="center" class="mt-2">
        <b-col cols="6">
        <b-button type="button" @click="goBack">Indietro</b-button>
        <b-button type="reset" variant="danger" v-on:click="onReset">Reset</b-button>
        <b-button type="submit" variant="warning"
            @click="evt => onSubmit(evt)">Valida</b-button>
        </b-col>
    </b-row>
  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import dettagliBeneMixin from '@/components/mixins/DettagliBene'
import Menu from '@/components/ui/Menu'
import BeneFormView from '@/components/ui/BeneFormView'
import BeneFormAddEdit from '@/components/ui/BeneFormAddEdit'
import lodashclonedeep from 'lodash.clonedeep'
import getModelloBene from '@/assets/js/Models/beneModel'
import MyMap from '@/components/ui/Map'
import axios from 'axios'
import qs from 'qs'

// @group Pages
// Valida un bene mostrando il confronto con la versione in archivio definitivo
export default {
  name: 'ValidaBene',
  components: { Menu, BeneFormView, BeneFormAddEdit, MyMap },
  mixins: [commonPageMixin, dettagliBeneMixin],
  data () {
    return {
      sendBtnClicked: false,
      formBeneArchDef: getModelloBene(),
      mapCenterArchDef: [0, 0],
      mapControls: { zoom: true, settings: false }
    }
  },
  methods: {
    onReset (evt) {
      evt.preventDefault()
      this.form = this.formRetrived
    },
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
    sendData () {
      let postData = lodashclonedeep(
        Object.assign({}, this.form, this.$store.getters.getUserData))
      // PostGIS vuole i punti come longitudine-latitudine
      postData.polygon = postData.polygon.flipCoordinates()
      let storeGetters = this.$store.getters
      let url = storeGetters.approvaBeneURL
      axios.post(url, qs.stringify(postData))
        .then(ok => {
          this.$vueEventBus.$emit('master-page-show-msg', ['Risposta', 'Ok', 'sendData'])
          if (this.leavePage) {
            this.$vueEventBus.$once('master-page-show-msg-ok-sendData',
              () => this.goBack())
          }
        })
    },
    init () {
      // resetto le variabili
      this.sendBtnClicked = false
      this.formBeneArchDef = getModelloBene()
      this.mapCenterArchDef = [0, 0]
      // resetto il modello dati scaricato in precedenza (se c'è)
      this.resetData()
      // scarico il bene definitivo se esiste
      this.fetchBeneDataByID(this.idBene, null, false, {
        noResultsMsg: 'Bene in archivio definitivo non trovato'
      })
        .then(data => {
          if (data) {
            this.formBeneArchDef = lodashclonedeep(data)
            this.mapCenterArchDef = lodashclonedeep(this.mapCenter)
          }
        })
        // dopo se esiste scarico il bene temporaneo
        .then(() => {
          this.resetData()
          let cercaInArchivioTempp = true
          this.fetchBeneDataByID(this.idBene, this.idUtente, cercaInArchivioTempp, {
            noResultsMsg: 'Bene da revisionare non trovato'
          })
        })
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    // ascolto cambiamenti nella url
    $route (to, from) {
      this.init()
    }
  },
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    let resp = true
    if (!this.sendBtnClicked) {
      // se il server non ha dato responso OK o se proprio non gli è stato mandato
      let formClone = Object.assign({}, this.form)
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
