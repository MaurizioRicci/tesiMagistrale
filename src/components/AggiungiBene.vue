<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <h2>Aggiungi un bene</h2>
<!--         <b-alert :show="showError" variant="danger">
          <p>Not logged in. <router-link to="/">Login</router-link></p>
        </b-alert> -->
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="6">
        <b-form @submit="onSubmit" @reset="onReset" :novalidate="true" :validated="sendBtnClicked" ref="form_bene">
          <b-form-group id="input-group-1" label="Lotto:" label-for="input-lotto" label-cols="2">
            <b-col cols="12">
              <b-form-input id="input-lotto" v-model="form.lotto" type="number" required placeholder=""></b-form-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Identificazione:" label-for="input-identificazione" label-cols="2">
            <b-col cols="12">
              <b-form-input
                id="input-identificazione"
                v-model="form.identificazione"
                type="text"
                required
                placeholder=""
              ></b-form-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Descrizione:" label-for="input-descrizione" label-cols="2">
            <b-col cols="12">
              <my-autocomplete-input v-model="form.descrizione"
               :suggestionsPromise="getDictFuncs().loadDescr"
               closedDictionaryy
               icon_name="lock"
               icon_msg="Campo vincolato a un dizionario">
                <b-form-input
                  id="input-descrizione"
                  v-model="form.descrizione"
                  type="text"
                  required
                  placeholder=""
                  autocomplete="off"
                ></b-form-input>
              </my-autocomplete-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="MacroEpocaOrig:" label-for="input-macro-epoca-orig" label-cols="2">
            <b-col cols="12">
              <my-autocomplete-input v-model="form.macroEpocaOrig"
               :suggestionsPromise="getDictFuncs().loadMacroEpocaOrig"
               closedDictionary
               icon_name="lock"
               icon_msg="Campo vincolato a un dizionario">
                <b-form-input
                  id="input-macro-epoca-orig"
                  type="text"
                  required
                  placeholder=""
                  autocomplete="off"
                ></b-form-input>
              </my-autocomplete-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="MacroEpocaCar:" label-for="input-macro-epoca-car" label-cols="2">
            <b-col cols="12">
              <my-autocomplete-input v-model="form.macroEpocaCar"
               :suggestionsPromise="getDictFuncs().loadMacroEpocaCar"
               closedDictionary
               icon_name="lock"
               icon_msg="Campo vincolato a un dizionario">
                <b-form-input
                  id="input-macro-epoca-car"
                  type="text"
                  required
                  placeholder=""
                  autocomplete="off"
                ></b-form-input>
              </my-autocomplete-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Esistenza:" label-for="input-esistenza" label-cols="2">
            <b-col cols="12">
              <b-form-input id="input-esistenza" v-model="form.esistenza" type="text" required placeholder=""></b-form-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Comune:" label-for="input-comune" label-cols="2">
            <b-col cols="12">
              <b-form-input id="input-comune" v-model="form.comune" type="text" required placeholder=""></b-form-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Bibliografia:" label-for="input-bibliografia" label-cols="2">
            <b-col cols="12">
              <b-form-textarea
                id="input-bibliografia"
                v-model="form.bibliografia"
                type="text"
                required
                placeholder=""
              ></b-form-textarea>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Note:" label-for="input-note" label-cols="2">
            <b-col cols="12">
              <b-form-textarea id="input-note" v-model="form.note" type="text" placeholder=""></b-form-textarea>
            </b-col>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import * as dict from '@/assets/js/loadDict'
import myAutocompleteInput from '@/components/MyAutocompleteInput'

export default {
  name: 'AggiungiBene',
  components: {'my-autocomplete-input': myAutocompleteInput},
  data () {
    return {
      form: this.getModel(),
      sendBtnClicked: false
    }
  },
  computed: {
    showError () {
      return !this.$store.getters.loggedIn
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
    getDictFuncs () { return dict }
  },
  mounted () {
    // dict.loadDescr(this)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
