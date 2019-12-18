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
        <h4>Funzione in archivio definitivo</h4>
        <FunzioneFormView :form="formFunzioneArchDef" :disallowIDChange="true"/>
        <!-- <MyMap ref="myMap1" locked :zoom="17" :controls="mapControls"
            v-model="formBeneArchDef.polygon" :center="mapCenterArchDef"/> -->
      </b-col>
      <b-col>
        <h4>Funzione da approvare</h4>
        <FunzioneFormAddEdit ref="form_funzione" v-model="form" no-draft
            :validated="sendBtnClicked"/>
        <!-- <MyMap ref="myMap2" v-model="form.polygon"
            :controls="mapControls"
            :zoom="17" :center="mapCenter"/> -->
      </b-col>
    </b-row>
    <b-row align-h="center" class="mt-2">
        <b-col cols="6">
        <b-button variant="primary" @click="goBack">Indietro</b-button>
        <b-button type="reset" variant="danger" v-on:click="onReset">Reset</b-button>
        <b-button type="submit" variant="warning"
            @click="evt => onSubmit(evt)">Valida</b-button>
        </b-col>
    </b-row>
  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import dettagliFunzioneMixin from '@/components/mixins/DettagliFunzione'
import Menu from '@/components/ui/Menu'
import FunzioneFormView from '@/components/ui/FunzioneFormView'
import FunzioneFormAddEdit from '@/components/ui/FunzioneFormAddEdit'
import lodashclonedeep from 'lodash.clonedeep'
import getModelloFunzione from '@/assets/js/Models/funzioneModel'
import MyMap from '@/components/ui/Map'
const axios = require('axios')
const qs = require('qs')

// Valida un bene mostrando il confronto con la versione in archivio definitivo
export default {
  name: 'ValidaFunzione',
  components: {Menu, FunzioneFormView, FunzioneFormAddEdit, MyMap},
  mixins: [commonPageMixin, dettagliFunzioneMixin],
  data () {
    return {
      sendBtnClicked: false,
      formFunzioneArchDef: getModelloFunzione(),
      mapCenterArchDef: [0, 0],
      mapControls: {zoom: false, settings: false}
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
      if (this.$refs.form_funzione.checkValidity()) {
        this.sendData()
      } else {
        // mostra un messaggio in un modal con un certo titolo e testo
        this.$vueEventBus.$emit('master-page-show-msg',
          ['Attenzione', 'Non hai finito di compilare i campi richiesti.'])
      }
    },
    sendData () {
      // da rivedere
      let postData = lodashclonedeep(Object.assign(this.form, this.$store.getters.getUserData))
      let storeGetters = this.$store.getters
      let url = this.editMode ? storeGetters.validaFunzioneURL : storeGetters.validaFunzioneURL
      axios.post(url, qs.stringify(postData))
        .then(ok => {
          this.$vueEventBus.$emit('master-page-show-msg', ['Risposta', 'Ok'])
          if (this.leavePage) {
            this.$vueEventBus.$once('master-page-show-msg-ok',
              () => this.goBack())
          }
        }, fail => {
          this.$vueEventBus.$emit('master-page-show-msg', ['Errore', fail.response.data.msg])
        })
    },
    init () {
      // resetto le variabili
      this.sendBtnClicked = false
      this.formFunzioneArchDef = getModelloFunzione()
      this.mapCenterArchDef = [0, 0]
      // resetto il modello dati scaricato in precedenza (se c'è)
      this.resetData()
      // scarico la funzione definitiva se esiste
      this.fetchFunzioneDataByID(this.idFunzione)
        .then(data => {
          if (data) {
            this.formFunzioneArchDef = lodashclonedeep(data)
            this.mapCenterArchDef = lodashclonedeep(this.mapCenter)
          }
        })
        // dopo se esiste scarico la funzione temporanea
        .then(() => {
          this.resetData()
          let cercaInArchivioTemp = true
          this.fetchFunzioneDataByID(this.idFunzione, this.idUtente, cercaInArchivioTemp)
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
