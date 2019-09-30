<template>
  <b-container>
    <b-row>
      <b-col>
        <h2>Visualizza bene</h2>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="12">
        <b-form :novalidate="true" ref="form_bene">
          <b-form-group id="input-group-1" label="Identificazione:" label-for="input-identificazione" label-cols="2">
            <b-col cols="12">
                  <b-form-input
                    disabled
                    id="input-identificazione"
                    type="text"
                    v-model="form.identificazione"
                    required
                    placeholder=""
                    autocomplete="off"
                  ></b-form-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Descrizione:" label-for="input-descrizione" label-cols="2">
            <b-col cols="12">
                <b-form-input
                    disabled
                  id="input-descrizione"
                  type="text"
                  v-model="form.descrizione"
                  required
                  placeholder=""
                  autocomplete="off"
                ></b-form-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="MacroEpocaOrig:" label-for="input-macro-epoca-orig" label-cols="2">
            <b-col cols="12">
                <b-form-input
                  disabled
                  id="input-macro-epoca-orig"
                  type="text"
                  v-model="form.macroEpocaOrig"
                  required
                  placeholder=""
                  autocomplete="off"
                ></b-form-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="MacroEpocaCar:" label-for="input-macro-epoca-car" label-cols="2">
            <b-col cols="12">
                <b-form-input
                  disabled
                  id="input-macro-epoca-car"
                  type="text"
                  v-model="form.macroEpocaCar"
                  required
                  placeholder=""
                  autocomplete="off"
                ></b-form-input>
            </b-col>
          </b-form-group>
            <b-form-group id="input-group-1" label="Toponimo:" label-for="input-toponimo" label-cols="2">
            <b-col cols="12">
              <b-form-input id="input-toponimo" disabled v-model="form.toponimo" type="text" required placeholder=""></b-form-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Esistenza:" label-for="input-esistenza" label-cols="2">
            <b-col cols="12">
              <b-form-input id="input-esistenza" disabled v-model="form.esistenza" type="text" required placeholder=""></b-form-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Comune:" label-for="input-comune" label-cols="2">
            <b-col cols="12">
              <b-form-input id="input-comune" disabled v-model="form.comune" type="text" required placeholder=""></b-form-input>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Bibliografia:" label-for="input-bibliografia" label-cols="2">
            <b-col cols="12">
              <b-form-textarea
                disabled
                id="input-bibliografia"
                v-model="form.bibliografia"
                type="text"
                required
                placeholder=""
              ></b-form-textarea>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Schedatore:" label-for="input-schedatore" label-cols="2">
            <b-col cols="12">
              <b-form-textarea
                disabled
                id="input-schedatore"
                v-model="form.schedatore"
                type="text"
                required
                placeholder=""
              ></b-form-textarea>
            </b-col>
          </b-form-group>
          <b-form-group id="input-group-1" label="Note:" label-for="input-note" label-cols="2">
            <b-col cols="12">
              <b-form-textarea disabled id="input-note" v-model="form.note" type="text" placeholder=""></b-form-textarea>
            </b-col>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
const axios = require('axios')

export default {
  name: 'VisualizzaBene',
  data () {
    return {
      form: this.getModel()
    }
  },
  props: {
    id: String
  },
  computed: {},
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
        schedatore: '',
        note: ''
      }
    }
  },
  mounted () {
    const T = this
    // fare richiesta dati del bene con id nella url
    axios.get(this.$store.getters.dettagliBeneURL, {
      params: { 'id': this.id }
    }).then((ok) => {
      T.form = ok.data[0]
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
