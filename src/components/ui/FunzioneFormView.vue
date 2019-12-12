<template>
  <div>
    <FunzioneFormToolTip/>
    <b-form :novalidate="true">
      <b-form-group id="input-group-1" label="ID bene:"
        label-for="input-id_bene" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-id_bene"
          type="number"
          v-model="form.id_bene"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Denominazione:"
        label-for="input-denominazione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-denominazione"
          type="text"
          v-model="form.denominazione"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Data:"
        label-for="input-data" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-data"
          type="text"
          v-model="form.data"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Tipo data:"
        label-for="input-tipodata" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-tipodata"
          type="text"
          v-model="form.tipodata"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Ruolo:" label-for="input-ruolo" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input id="input-ruolo" v-for="(ruolo, index) in form.ruolo"
          :key="index" :value="ruolo" type="text" disabled placeholder=""></b-form-input>
<!-- per sincronizzare ruolo con modello dati mettere un listener su @change e fare $set(this.form, index, newVal) -->
      </b-form-group>
      <b-form-group id="input-group-1" label="Funzione:" label-for="input-funzione" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
        <b-form-input id="input-funzione" v-model="form.funzione" type="text" disabled placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="ID bene rif:" label-for="input-id_bener" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
        <b-form-input id="input-id_bener" v-model="form.id_bener" type="number" disabled placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Denominazione rif:" label-for="input-denominazioner" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
        <b-form-input id="input-denominazioner" v-model="form.denominazioner" type="text" disabled placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Ruolo rif:" label-for="input-ruolor" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
          <b-form-input id="input-ruolor" v-for="(ruolor, index) in form.ruolor"
            :key="index" :value="ruolor" type="text" disabled placeholder=""></b-form-input>
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
    </b-form>
  </div>
</template>

<script>
import FunzioneFormToolTip from '@/components/ui/FunzioneFormToolTip'
export default {
  name: 'FormFunzioneLettura',
  components: {FunzioneFormToolTip},
  data () {
    return {}
  },
  props: {
    form: {type: Object, required: true}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
