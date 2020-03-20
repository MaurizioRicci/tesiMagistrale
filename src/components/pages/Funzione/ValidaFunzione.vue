<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <h2 v-if="!noTitle">{{title || 'Valida una funzione'}}</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4 class="mb-0">Funzione in archivio definitivo</h4>
        <span>Nel caso in cui una funzione venga modificata mostra lo stato della funzione in analisi prima della modifica.</span>
        <FunzioneFormView :form="formFunzioneArchDef" :disallowIDChange="true"/>
      </b-col>
      <b-col>
        <h4 class="mb-0">Funzione da approvare</h4>
        <span>Mostra la funzione da approvare, è possibile apportare modifiche.</span>
        <FunzioneFormAddEdit ref="form_funzione" v-model="form" no-draft
            :validated="sendBtnClicked"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <MyMap ref="myMap2" :zoom="17"/>
      </b-col>
    </b-row>
    <b-row align-h="center" class="mt-2">
        <b-col cols="6">
        <b-button type="button" @click="goBack">Indietro</b-button>
        <b-button type="reset" variant="danger" v-on:click="onReset">Reset</b-button>
        <b-button type="submit" variant="warning"
            @click="waitUserConfirmation=true;">Valida</b-button>
        </b-col>
    </b-row>
    <b-row>
      <b-col>
        <RicercaFunzioniApprovate noActions/>
      </b-col>
    </b-row>

    <b-toast id="confirm-toastApprova" title="Richiesta conferma" solid no-auto-hide
      toaster="b-toaster-bottom-center" variant="secondary" v-model="waitUserConfirmation">
      <div class="row justify-content-center">
        <div class="col-12">
          <p>Sei sicuro di volere approvare?
          </p>
        </div>
        <div class="col-auto">
          <b-button variant="warning" @click="onSubmit">Conferma</b-button>
        </div>
      </div>
    </b-toast>

  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import dettagliFunzioneMixin from '@/components/mixins/DettagliFunzione'
import Menu from '@/components/ui/Menu'
import FunzioneFormView from '@/components/ui/FunzioneFormView'
import FunzioneFormAddEdit from '@/components/ui/FunzioneFormAddEdit'
import RicercaFunzioniApprovate from '@/components/ui/RicercaFunzioniApprovate'
import lodashclonedeep from 'lodash.clonedeep'
import getModelloFunzione from '@/assets/js/Models/funzioneModel'
import MyMap from '@/components/ui/Map'
import { ternaVera } from '@/assets/js/date/dateF'
import axios from 'axios'
import qs from 'qs'

// @group Pages
// Valida una funzione mostrando il confronto con la versione in archivio definitivo
export default {
  name: 'ValidaFunzione',
  components: { Menu, FunzioneFormView, FunzioneFormAddEdit, MyMap, RicercaFunzioniApprovate },
  mixins: [commonPageMixin, dettagliFunzioneMixin],
  data () {
    return {
      sendBtnClicked: false,
      formFunzioneArchDef: getModelloFunzione(),
      mapCenterArchDef: [0, 0],
      // usato per aprire il messaggio di conferma di validazione
      waitUserConfirmation: false
    }
  },
  computed: {
    ternaValida () {
      return ternaVera(this.form.data_ante, this.form.data_poste, this.form.tipodata)
    }
  },
  methods: {
    onReset (evt) {
      evt.preventDefault()
      this.init()
    },
    onSubmit () {
      // serve a innescare la validazione del form. Vedi <form...> a inizio
      this.sendBtnClicked = true
      if (this.$refs.form_funzione.checkValidity()) {
        this.sendData()
      } else {
        // mostra un messaggio in un modal con un certo titolo e testo
        this.$vueEventBus.$emit('master-page-show-msg',
          ['Attenzione', 'Non hai finito di compilare i campi richiesti.'])
      }
    },
    sendData () {
      if (!this.ternaValida) {
        this.$vueEventBus.$emit('master-page-show-msg',
          ['Attenzione', 'Data anteriore, data posteriore e tipo data non coerenti tra loro.'])
      } else {
        let postData = lodashclonedeep(
          Object.assign({}, this.form, this.$store.getters.getUserData))
        let storeGetters = this.$store.getters
        let url = storeGetters.approvaFunzioneURL
        axios.post(url, qs.stringify(postData))
          .then(ok => {
            // dopo aver cliccato ok torno alla pagina indietro
            this.$vueEventBus.$once('master-page-show-msg-ok-sendData',
              () => this.goBack())
            this.$vueEventBus.$emit('master-page-show-msg', ['Risposta', 'Funzione inserita in archivio definitivo', 'sendData'])
            this.waitUserConfirmation = false
          })
      }
    },
    init () {
      // resetto le variabili
      this.sendBtnClicked = false
      this.formFunzioneArchDef = getModelloFunzione()
      this.mapCenterArchDef = [0, 0]
      // resetto il modello dati scaricato in precedenza (se c'è)
      this.resetData()
      // scarico la funzione definitiva se esiste
      return this.fetchFunzioneDataByID(this.idFunzione, null, false, {
        noResultsMsg: 'Funzione in archivio definitivo non trovata. Quindi la funzione in verifica è nuova.'
      })
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
  },
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    let resp = true
    if (!this.sendBtnClicked) {
      // se il server non ha dato responso OK o se proprio non gli è stato mandato
      let formClone = lodashclonedeep(this.form)
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
