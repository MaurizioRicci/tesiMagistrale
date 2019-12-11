<template>
  <div>
    <BeneFormToolTip/>
    <b-form :novalidate="true">
      <b-form-group id="input-group-1" label="ID:"
        label-for="input-id" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-id"
          type="text"
          v-model="form.id"
          placeholder=""
          autocomplete="off"
          @keyup.enter="$emit('requestedId', form.id)"
          :disabled="this.disallowIDChange"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Identificazione:"
        label-for="input-identificazione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-identificazione"
          type="text"
          v-model="form.identificazione"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Descrizione:"
        label-for="input-descrizione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-descrizione"
          type="text"
          v-model="form.descrizione"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="MacroEpocaOrig:"
        label-for="input-macro-epoca-orig" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-macro-epoca-orig"
          type="text"
          v-model="form.macroEpocaOrig"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="MacroEpocaCar:"
        label-for="input-macro-epoca-car" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-macro-epoca-car"
          type="text"
          v-model="form.macroEpocaCar"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Toponimo:" label-for="input-toponimo" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input id="input-toponimo" v-model="form.toponimo"
          type="text" disabled placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Esistenza:" label-for="input-esistenza" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input id="input-esistenza" v-model="form.esistenza" type="text" disabled placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Comune:" label-for="input-comune" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input id="input-comune" v-model="form.comune" type="text" disabled placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Bibliografia:" label-for="input-bibliografia" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea
          id="input-bibliografia"
          v-model="form.bibliografia"
          type="text"
          disabled
          placeholder=""></b-form-textarea>
      </b-form-group>
      <b-form-group id="input-group-1" label="Schedatori:" label-for="input-schedatori" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea
          id="input-schedatori"
          v-model="form.schedatori_iniziali"
          type="text"
          disabled
          placeholder=""></b-form-textarea>
      </b-form-group>
      <b-form-group id="input-group-1" label="Note:" label-for="input-note" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea disabled id="input-note" v-model="form.note" type="text" placeholder=""></b-form-textarea>
      </b-form-group>
      <b-form-group id="input-group-1" label="Geometria:" label-for="input-geometria" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea disabled id="input-geometria" v-model="polygonStr" type="text" placeholder=""></b-form-textarea>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import BeneFormToolTip from '@/components/ui/BeneFormToolTip'
export default {
  name: 'FormBeneLettura',
  components: {BeneFormToolTip},
  data () {
    return {}
  },
  props: {
    form: {type: Object, required: true},
    disallowIDChange: Boolean
  },
  computed: {
    polygonStr: function () { return this.form.polygon.toString() }
  },
  watch: {
    form: {
      deep: true,
      handler: function () { this.$emit('change', this.form) }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
