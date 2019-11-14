<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
        <b-col>
          <LoginWarning/>
          <b-alert variant="success" :show="serverRespOk">Bene creato/aggiunto</b-alert>
          <h2 v-if="!noTitle">{{title || 'Aggiungi/Modifica un bene'}}</h2>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <transition name="slide-fade" v-on:leave="mapCols = 12">
          <!-- 12-mapCols > 0 => se la mappa occupa 12 colonne allora il form è nascosto -->
          <b-col cols="8" v-show="12-mapCols > 0">
            <b-form @submit="onSubmit" @reset="onReset" :novalidate="true" :validated="sendBtnClicked" ref="form_bene">
              <b-form-group id="input-group-1" label="ID:" label-for="input-id" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
                <b-form-input
                  id="input-id"
                  v-model="form.id"
                  type="text"
                  required
                  placeholder=""
                  @keyup.enter="() => fetchDataByID(form.id)">
                  </b-form-input>
              </b-form-group>
              <b-form-group id="input-group-1" label="Identificazione:"
              label-for="input-identificazione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
                <remote-contextual-suggestion :waitTime="1000"
                :suggestionsPromise="queryIdentificazione">
                  <my-autocomplete-input v-model="form.identificazione"
                  v-on:suggestion-picked="mostraDettagliBene">
                    <b-form-input
                      id="input-identificazione"
                      type="text"
                      v-model="form.identificazione"
                      required
                      placeholder=""
                      autocomplete="off"
                    ></b-form-input>
                  </my-autocomplete-input>
                </remote-contextual-suggestion>
              </b-form-group>
              <b-form-group id="input-group-1" label="Descrizione:"
                label-for="input-descrizione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
                <my-autocomplete-input v-model="form.descrizione"
                  :suggestionsPromise="getDictFuncs().loadDescr"
                  closedDictionary
                  icon_name="fa-lock"
                  icon_msg="Campo vincolato a un dizionario">
                  <b-form-textarea
                  id="input-descrizione"
                  type="text"
                  v-model="form.descrizione"
                  required
                  placeholder=""
                  autocomplete="off"
                ></b-form-textarea>
                </my-autocomplete-input>
              </b-form-group>
              <b-form-group id="input-group-1" label="MacroEpocaOrig:"
                label-for="input-macro-epoca-orig" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
                  <my-autocomplete-input v-model="form.macroEpocaOrig"
                  :suggestionsPromise="getDictFuncs().loadMacroEpocaOrig"
                  closedDictionary
                  icon_name="fa-lock"
                  icon_msg="Campo vincolato a un dizionario">
                    <b-form-input
                      id="input-macro-epoca-orig"
                      type="text"
                      v-model="form.macroEpocaOrig"
                      required
                      placeholder=""
                      autocomplete="off"
                    ></b-form-input>
                  </my-autocomplete-input>
              </b-form-group>
              <b-form-group id="input-group-1" label="MacroEpocaCar:"
                label-for="input-macro-epoca-car" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
                  <my-autocomplete-input v-model="form.macroEpocaCar"
                  :suggestionsPromise="getDictFuncs().loadMacroEpocaCar"
                  closedDictionary
                  icon_name="fa-lock"
                  icon_msg="Campo vincolato a un dizionario">
                    <b-form-input
                      id="input-macro-epoca-car"
                      type="text"
                      v-model="form.macroEpocaCar"
                      required
                      placeholder=""
                      autocomplete="off"
                    ></b-form-input>
                  </my-autocomplete-input>
              </b-form-group>
              <b-form-group id="input-group-1" label="Toponimo:" label-for="input-toponimo" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
                <remote-contextual-suggestion :waitTime="1000"
                :suggestionsPromise="queryToponimo">
                  <my-autocomplete-input v-model="form.toponimo">
                    <b-form-input
                      id="input-toponimo"
                      type="text"
                      v-model="form.toponimo"
                      placeholder=""
                      autocomplete="off"
                    ></b-form-input>
                  </my-autocomplete-input>
                </remote-contextual-suggestion>
              </b-form-group>
              <b-form-group id="input-group-1" label="Esistenza:" label-for="input-esistenza" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
                <b-form-input id="input-esistenza" v-model="form.esistenza" type="text" required placeholder=""></b-form-input>
              </b-form-group>
              <b-form-group id="input-group-1" label="Comune:" label-for="input-comune" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
                <remote-contextual-suggestion :waitTime="1000"
                :suggestionsPromise="queryComune">
                  <my-autocomplete-input v-model="form.comune">
                    <b-form-input
                      id="input-comune"
                      type="text"
                      v-model="form.comune"
                      placeholder=""
                      autocomplete="off"
                    ></b-form-input>
                  </my-autocomplete-input>
                </remote-contextual-suggestion>
              </b-form-group>
              <b-form-group id="input-group-1" label="Bibliografia:" label-for="input-bibliografia" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
                <b-form-textarea
                  id="input-bibliografia"
                  v-model="form.bibliografia"
                  type="text"
                  placeholder=""></b-form-textarea>
              </b-form-group>
              <b-form-group id="input-group-1" label="Note:" label-for="input-note" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
                <b-form-textarea id="input-note" v-model="form.note" type="text" placeholder=""></b-form-textarea>
              </b-form-group>
              <b-button type="submit" variant="primary">Submit</b-button>
              <b-button type="reset" variant="danger" v-on:click="onReset">Reset</b-button>
            </b-form>
          </b-col>
        </transition>
        <b-col :cols="mapCols">
          <MyMap ref="myMap" v-if="mapCenter" @ingrandisci-mappa="ingrandisciMappa"
          v-model="form.polygon" :center="mapCenter" :zoom="17"
           @rimpicciolisci-mappa="rimpicciolisciMappa"/>
        </b-col>
      </b-row>
      <b-button v-b-modal.modalViewBene>Show Modal</b-button>
      <b-modal title="Dettagli bene" id="modalViewBene"
        size="huge" v-on:ok="onModalClosedOK">
        <Dettagli-bene :id="idBeneDaVisualizzare">
        </Dettagli-bene>
        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button size="md" variant="outline-primary" @click="cancel()">
            Cancel
          </b-button>
          <b-button size="md" variant="danger" @click="ok()" >
            Modifica bene
          </b-button>
        </template>
      </b-modal>

      <b-toast id="confirm-toast" title="Richiesta conferma" solid no-auto-hide
      toaster="b-toaster-bottom-full" variant="secondary" v-model="waitUserConfirmation">
      <div class="">
        <div class="row justify-content-center">
        <p>Fintanto che il bene sarà in attesa revisione non potrai modificarlo</p>
        </div>
        <div class="row justify-content-center">
        <b-button @click="sendData">Conferma</b-button>
        </div>
      </div>
    </b-toast>
  </b-container>
</template>

<script>
import pageCommonMixin from '@/components/mixins/PageCommon'
import dettagliBeneMixin from '@/components/mixins/DettagliBene'
import * as dict from '@/assets/js/loadDict'
import Menu from '@/components/ui/Menu'
import LoginWarning from '@/components/ui/LoginWarning'
import MyAutocompleteInput from '@/components/ui/MyAutocompleteInput'
import MyMap from '@/components/ui/Map'
import RemoteContextualSugg from '@/components/common/RemoteContextualSuggestions'
import DettagliBene from '@/components/pages/Bene/ViewBene' // questo poi andrà tolto
import '@/assets/css/hugeModal.css'
import '@/assets/css/slideFadeTransition.css'
const axios = require('axios')

export default {
  name: 'AggiungiModificaBene',
  components: {
    Menu,
    LoginWarning,
    'my-autocomplete-input': MyAutocompleteInput,
    'remote-contextual-suggestion': RemoteContextualSugg,
    DettagliBene,
    MyMap
  },
  mixins: [pageCommonMixin, dettagliBeneMixin],
  data () {
    return {
      mapCols: 4,
      sendBtnClicked: false,
      idBeneDaVisualizzare: '', // da cancellare
      serverRespOk: false, // serve per innescare il messaggio di bene creato/modificato,
      waitUserConfirmation: false // apre il messaggio: sei sicuro di inviare il bene?
    }
  },
  props: {
    id: String,
    cercaInRevisione: Boolean
  },
  computed: {
    queryIdentificazione () {
      return () => axios.get(this.$store.getters.filtraBeniURL, {
        params: this.form
      })
    },
    queryToponimo () {
      return () => axios.get(this.$store.getters.filtraToponimoURL, {
        params: this.form
      })
    },
    queryComune () {
      return () => axios.get(this.$store.getters.filtraComuneURL, {
        params: this.form
      })
    }
  },
  methods: {
    onReset (evt) {
      evt.preventDefault()
      this.form = this.getModel()
    },
    onSubmit (evt) {
      // quando si preme invio sul form
      this.sendBtnClicked = true // serve a innescare la validazione del form
      evt.preventDefault()
      if (this.$refs.form_bene.checkValidity()) {
        // se il form è ok, chiedo la conferma
        this.waitUserConfirmation = true
      }
    },
    sendData () {
      // invio effettivo dei dati al server. form ok & utente è sicuro di quello che fa
    },
    getDictFuncs () { return dict },
    mostraDettagliBene (evt) {
      this.idBeneDaVisualizzare = evt.id
      this.$bvModal.show('modalViewBene')
    },
    onModalClosedOK () { // da cancellare poi insieme al modal
      const T = this
      // fare richiesta dati del bene con id nella url
      axios.get(this.$store.getters.dettagliBeneURL, {
        params: { 'id': this.idBeneDaVisualizzare }
      }).then((ok) => {
        delete ok.data.schedatore
        T.$refs.identificazioneAutoCompleteInput.hide()
        T.form = ok.data
      })
    },
    ingrandisciMappa () {
      this.mapCols = 12
      this.$nextTick(() => this.$refs.myMap.invalidateSize())
    },
    rimpicciolisciMappa () {
      this.mapCols = 4
      this.$nextTick(() => this.$refs.myMap.invalidateSize())
    }
  },
  mounted () {
    if (this.id) {
      this.fetchDataByID(this.id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
