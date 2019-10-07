<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <login-warning/>
        <h2>Aggiungi/Modifica un bene</h2>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="6">
        <b-form @submit="onSubmit" @reset="onReset" :novalidate="true" :validated="sendBtnClicked" ref="form_bene">
          <b-form-group id="input-group-1" label="Identificazione:"
          label-for="input-identificazione" label-cols-sm="6" label-cols-md="2">
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
            label-for="input-descrizione" label-cols-sm="6" label-cols-md="2">
            <my-autocomplete-input v-model="form.descrizione"
              :suggestionsPromise="getDictFuncs().loadDescr"
              closedDictionaryy
              icon_name="lock"
              icon_msg="Campo vincolato a un dizionario">
              <b-form-input
              id="input-descrizione"
              type="text"
              v-model="form.descrizione"
              required
              placeholder=""
              autocomplete="off"
            ></b-form-input>
            </my-autocomplete-input>
          </b-form-group>
          <b-form-group id="input-group-1" label="MacroEpocaOrig:"
            label-for="input-macro-epoca-orig" label-cols-sm="6" label-cols-md="2">
              <my-autocomplete-input v-model="form.macroEpocaOrig"
               :suggestionsPromise="getDictFuncs().loadMacroEpocaOrig"
               closedDictionary
               icon_name="lock"
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
            label-for="input-macro-epoca-car" label-cols-sm="6" label-cols-md="2">
              <my-autocomplete-input v-model="form.macroEpocaCar"
               :suggestionsPromise="getDictFuncs().loadMacroEpocaCar"
               closedDictionary
               icon_name="lock"
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
          <b-form-group id="input-group-1" label="Toponimo:" label-for="input-toponimo" label-cols-sm="6" label-cols-md="2">
            <remote-contextual-suggestion :waitTime="1000"
            :suggestionsPromise="queryToponimo">
              <my-autocomplete-input v-model="form.toponimo">
                <b-form-input
                  id="input-toponimo"
                  type="text"
                  v-model="form.toponimo"
                  required
                  placeholder=""
                  autocomplete="off"
                ></b-form-input>
              </my-autocomplete-input>
            </remote-contextual-suggestion>
          </b-form-group>
          <b-form-group id="input-group-1" label="Esistenza:" label-for="input-esistenza" label-cols-sm="6" label-cols-md="2">
            <b-form-input id="input-esistenza" v-model="form.esistenza" type="text" required placeholder=""></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-1" label="Comune:" label-for="input-comune" label-cols-sm="6" label-cols-md="2">
            <remote-contextual-suggestion :waitTime="1000"
            :suggestionsPromise="queryComune">
              <my-autocomplete-input v-model="form.comune">
                <b-form-input
                  id="input-comune"
                  type="text"
                  v-model="form.comune"
                  required
                  placeholder=""
                  autocomplete="off"
                ></b-form-input>
              </my-autocomplete-input>
            </remote-contextual-suggestion>
          </b-form-group>
          <b-form-group id="input-group-1" label="Bibliografia:" label-for="input-bibliografia" label-cols-sm="6" label-cols-md="2">
            <b-form-textarea
              id="input-bibliografia"
              v-model="form.bibliografia"
              type="text"
              required
              placeholder=""></b-form-textarea>
          </b-form-group>
          <b-form-group id="input-group-1" label="Note:" label-for="input-note" label-cols-sm="6" label-cols-md="2">
            <b-form-textarea id="input-note" v-model="form.note" type="text" placeholder=""></b-form-textarea>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger" v-on:click="onReset">Reset</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-button v-b-modal.modalViewBene>Show Modal</b-button>
    <b-modal title="Dettagli bene" id="modalViewBene"
      size="xl" v-on:ok="onModalClosedOK">
      <dettagli-bene :id="idBeneDaVisualizzare">
      </dettagli-bene>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="md" variant="outline-primary" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="md" variant="danger" @click="ok()" >
          Modifica bene
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import * as dict from '@/assets/js/loadDict'
import LoginWarning from '@/components/ui/LoginWarning'
import myAutocompleteInput from '@/components/ui/MyAutocompleteInput'
import remoteContextualSugg from '@/components/common/RemoteContextualSuggestions'
import dettagliBene from '@/components/pages/Bene/ViewBene'

const axios = require('axios')

export default {
  name: 'AggiungiModificaBene',
  components: {
    'login-warning': LoginWarning,
    'my-autocomplete-input': myAutocompleteInput,
    'remote-contextual-suggestion': remoteContextualSugg,
    'dettagli-bene': dettagliBene
  },
  data () {
    return {
      form: this.getModel(),
      sendBtnClicked: false,
      idBeneDaVisualizzare: ''
    }
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
    getModel () {
      return {
        lotto: '',
        identificazione: '',
        descrizione: '',
        macroEpocaOrig: '',
        macroEpocaCar: '',
        toponimo: '',
        esitenza: '',
        comune: '',
        bibliografia: '',
        note: ''
      }
    },
    onReset (evt) {
      evt.preventDefault()
      this.form = this.getModel()
    },
    onSubmit (evt) {
      this.sendBtnClicked = true
      evt.preventDefault()
    },
    getDictFuncs () { return dict },
    mostraDettagliBene (evt) {
      this.idBeneDaVisualizzare = evt.id
      this.$bvModal.show('modalViewBene')
    },
    onModalClosedOK () {
      const T = this
      // fare richiesta dati del bene con id nella url
      axios.get(this.$store.getters.dettagliBeneURL, {
        params: { 'id': this.idBeneDaVisualizzare }
      }).then((ok) => {
        delete ok.data[0].schedatore
        T.$refs.identificazioneAutoCompleteInput.hide()
        T.form = ok.data[0]
      })
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
