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
          <LoadingOverlay ref="loadingOverlay"/>
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
    <b-row>
      <b-col>
        <h4 class="mb-0">Bene in archivio definitivo</h4>
        <span>Nel caso in cui un bene venga modificato mostra lo stato del bene in analisi prima della modifica.</span>
        <BeneFormView :form="formBeneArchDef" :disallowIDChange="true"/>
        <MyMap ref="myMap1" locked :zoom="17" :controls="mapControls"
            v-model="formBeneArchDef.polygon" :center="mapCenterArchDef"/>
      </b-col>
      <b-col>
        <h4 class="mb-0">Bene da approvare</h4>
        <span>Mostra il bene da approvare, è possibile apportare modifiche.</span>
        <BeneFormAddEdit ref="form_bene" v-model="form" no-draft
            :validated="sendBtnClicked"/>
        <MyMap ref="myMap2" v-model="form.polygon"
            :controls="mapControls" @change="checkPolygonDist"
            :zoom="17" :center="mapCenter"/>
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
        <RicercaBeniApprovati noActions/>
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
import dettagliBeneMixin from '@/components/mixins/DettagliBene'
import Menu from '@/components/ui/Menu'
import BeneFormView from '@/components/ui/BeneFormView'
import BeneFormAddEdit from '@/components/ui/BeneFormAddEdit'
import RicercaBeniApprovati from '@/components/ui/RicercaBeniApprovati'
import LoadingOverlay from '@/components/ui/LoadingOverlay'
import lodashclonedeep from 'lodash.clonedeep'
import getModelloBene from '@/assets/js/Models/beneModel'
import BeneOverview from '@/components/ui/BeneOverview'
import MyMap from '@/components/ui/Map'
import axios from 'axios'
import qs from 'qs'

// @group Pages
// Valida un bene mostrando il confronto con la versione in archivio definitivo
export default {
  name: 'ValidaBene',
  components: { Menu, BeneFormView, BeneFormAddEdit, MyMap, BeneOverview, RicercaBeniApprovati, LoadingOverlay },
  mixins: [commonPageMixin, dettagliBeneMixin],
  data () {
    return {
      sendBtnClicked: false,
      // form bene archivio definitivo se presente
      formBeneArchDef: getModelloBene(),
      mapCenterArchDef: [0, 0],
      mapControls: { zoom: true, settings: false },
      // array di eventuali beni sovrapposti a quello che si sta creando
      beniVicini: [],
      // usato per aprire il messaggio di conferma di validazione
      waitUserConfirmation: false
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
      if (this.$refs.form_bene.checkValidity()) {
        this.sendData()
      } else {
        // mostra un messaggio in un modal con un certo titolo e testo
        this.$vueEventBus.$emit('master-page-show-msg',
          ['Attenzione', 'Non hai finito di compilare i campi richiesti.'])
      }
    },
    sendData () {
      // mostro la schermata di caricamento
      this.$refs.loadingOverlay.show()
      let postData = lodashclonedeep(
        Object.assign({}, this.form, this.$store.getters.getUserData))
      // PostGIS vuole i punti come longitudine-latitudine
      postData.polygon = postData.polygon.flipCoordinates()
      let storeGetters = this.$store.getters
      let url = storeGetters.approvaBeneURL
      axios.post(url, qs.stringify(postData))
        .then(ok => {
          // dopo aver cliccato ok torno alla pagina indietro
          this.$vueEventBus.$once('master-page-show-msg-ok-sendData',
            () => this.goBack())
          this.$vueEventBus.$emit('master-page-show-msg', ['Risposta', 'Bene inserito in archivio definitivo', 'sendData'])
          this.waitUserConfirmation = false
        })
        // nascondo la schermata di caricamento
        .finally(() => this.$refs.loadingOverlay.hide())
    },
    checkPolygonDist () {
      // controllo la distanza da altri beni
      let postData = lodashclonedeep(
        Object.assign({}, this.form, this.$store.getters.getUserData))
      // PostGIS vuole i punti come longitudine-latitudine
      postData.polygon = postData.polygon.flipCoordinates()
      axios.post(this.$store.getters.checkDistURL, qs.stringify(postData))
        .then(resp => { this.beniVicini = resp.data || [] })
    },
    init () {
      // resetto le variabili
      this.sendBtnClicked = false
      this.formBeneArchDef = getModelloBene()
      this.mapCenterArchDef = [0, 0]
      this.beniVicini = []
      // resetto il modello dati scaricato in precedenza (se c'è)
      this.resetData()
      // scarico il bene definitivo se esiste e rendo una promessa
      return this.fetchBeneDataByID(this.idBene, null, false, {
        noResultsMsg: 'Bene in archivio definitivo non trovato. Quindi il bene in verifica è nuovo.'
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
    // mettere l'inizializzazione dentro init poichè non si può invocare nuovamente mounted
    // controllo la distanza tra la geometria data e quella nei vari archivi
    this.init().then(() => this.checkPolygonDist())
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
