<template>
  <div>
    <BeneFormToolTip/>
    <!-- id del form serve per i tooltip -->
    <b-form :novalidate="true" :validated="validated" ref="form_bene" id="bene_form_add_edit">
      <b-form-checkbox @change="checked => checked ? form.setIncomplete() : form.setReady()"
        :checked="form.isIncomplete()"
        name="check-button-bozza" switch v-if="!noDraft"
        id="checkbox-bozza" size="lg" class="mb-1">
        Aggiungi alle bozze
      </b-form-checkbox>
      <b-form-group id="input-group-id" label="ID:" label-for="input-id" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-id"
          v-model="form.id"
          type="text"
          required
          disabled
          placeholder="">
        </b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Identificazione:"
        label-for="input-identificazione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <remote-contextual-suggestions :waitTime="1000"
          :suggestionsPromise="queryIdentificazione">
          <my-autocomplete-input v-model="form.identificazione">
            <b-form-input
              id="input-identificazione"
              type="text"
              v-model="form.identificazione"
              required
              placeholder=""
              autocomplete="off"
              ></b-form-input>
          </my-autocomplete-input>
        </remote-contextual-suggestions>
      </b-form-group>
      <b-form-group id="input-group-1" label="Descrizione:"
        label-for="input-descrizione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea
          id="input-descrizione"
          type="text"
          v-model="form.descrizione"
          placeholder=""
          autocomplete="off"></b-form-textarea>
      </b-form-group>
      <b-form-group id="input-group-1" label="MacroEpocaOrig:"
        label-for="input-macro-epoca-orig" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <my-autocomplete-input v-model="form.macroEpocaOrig"
          :suggestionsPromise="getDictFuncs().loadMacroEpocaOrig"
          closedDictionary
          icon_name="lock"
          icon_msg="Campo vincolato a un dizionario">
          <b-form-input
            id="input-macro-epoca-orig"
            type="text"
            v-model="form.macroEpocaOrig"
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
          icon_name="lock"
          icon_msg="Campo vincolato a un dizionario">
          <b-form-input
            id="input-macro-epoca-car"
            type="text"
            v-model="form.macroEpocaCar"
            placeholder=""
            autocomplete="off"
            ></b-form-input>
        </my-autocomplete-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Toponimo:" label-for="input-toponimo" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <remote-contextual-suggestions :waitTime="1000"
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
        </remote-contextual-suggestions>
      </b-form-group>
      <b-form-group id="input-group-1" label="Esistenza:" label-for="input-esistenza" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <my-autocomplete-input v-model="form.esistenza" closedDictionary
          :suggestionsPromise="getDictFuncs().loadEsistenza">
          <b-form-input
            id="input-esistenza"
            type="text"
            v-model="form.esistenza"
            placeholder=""
            autocomplete="off"
            ></b-form-input>
        </my-autocomplete-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Comune:" label-for="input-comune" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <remote-contextual-suggestions :waitTime="1000"
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
        </remote-contextual-suggestions>
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
      <b-form-group id="input-group-1" label="Geometria:" label-for="input-geometria" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea disabled id="input-geometria" :value="polygonStr" type="text" placeholder=""></b-form-textarea>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import BeneFormToolTip from '@/components/ui/BeneFormToolTip'
import MyAutocompleteInput from '@/components/ui/MyAutocompleteInput'
import RemoteContextualSuggestions from '@/components/common/RemoteContextualSuggestions'
import * as dict from '@/assets/js/loadDict'
import axios from 'axios'

export default {
  name: 'FormBeneLeggiScrivi',
  components: {
    BeneFormToolTip,
    MyAutocompleteInput,
    RemoteContextualSuggestions
  },
  mixins: [],
  props: {
    validated: Boolean,
    form: Object,
    // non mostra la possibilità di aggiungere alle bozze
    // serve per la validazione
    noDraft: Boolean
  },
  model: {
    prop: 'form',
    event: 'change'
  },
  methods: {
    getDictFuncs () { return dict },
    checkValidity () { return this.$refs.form_bene.checkValidity() }
  },
  computed: {
    polygonStr: function () { return this.form.polygon.toString() },
    queryIdentificazione () {
      return () => axios.get(this.$store.getters.filtraIdentURL, {
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
