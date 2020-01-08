<template>
  <div>
    <FunzioneFormToolTip prefix="funzione_form_view_"/>
    <b-form :novalidate="true">
      <b-form-group id="input-group-1" label="ID bene:"
        label-for="funzione_form_view_input-id_bene" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="funzione_form_view_input-id_bene"
          type="number"
          v-model="form.id_bene"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Denominazione:"
        label-for="funzione_form_view_input-denominazione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="funzione_form_view_input-denominazione"
          type="text"
          v-model="form.denominazione"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <!-- data -->
      <b-form-group id="input-group-1" label="Data:"
        label-for="funzione_form_view_input-data" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="funzione_form_view_input-data"
          type="text"
          v-model="form.data"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Data anteriore:"
        label-for="funzione_form_view_input-data_ante" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="funzione_form_view_input-data_ante"
          type="text"
          v-model="form.data_ante"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Data posteriore:"
        label-for="funzione_form_view_input-data_poste" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="funzione_form_view_input-data_poste"
          type="text"
          v-model="form.data_poste"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Tipo data:"
        label-for="funzione_form_view_input-tipodata" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="funzione_form_view_input-tipodata"
          type="text"
          v-model="form.tipodata"
          disabled
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <!-- ruolo 1 -->
      <span id="input_ruolo" v-for="(ruolor, index) in form.ruolor" :key="'ruolo'+index">
        <b-form-group id="input-group-1" label="Ruolo:"
          :label-for="'input-ruolo'+index" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
            <b-form-input
              :value="form.ruolo[index]"
              :id="'input-ruolo'+index"
              type="text"
              placeholder=""
              disabled></b-form-input>
        </b-form-group>
      </span>
      <b-form-group id="input-group-1" label="Funzione:" label-for="funzione_form_view_input-funzione" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
        <b-form-input id="funzione_form_view_input-funzione" v-model="form.funzione" type="text" disabled placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="ID bene rif:" label-for="funzione_form_view_input-id_bener" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
        <b-form-input id="funzione_form_view_input-id_bener" v-model="form.id_bener" type="number" disabled placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Denominazione rif:" label-for="funzione_form_view_input-denominazioner" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
        <b-form-input id="funzione_form_view_input-denominazioner" v-model="form.denominazioner" type="text" disabled placeholder=""></b-form-input>
      </b-form-group>
      <!-- ruolo 2 -->
      <span id="input_ruolor" v-for="(ruolor, index) in form.ruolor" :key="'ruolor'+index">
        <b-form-group id="input-group-1" label="Ruolo rif:"
          :label-for="'input-ruolor'+index" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
            <b-form-input
              :value="form.ruolor[index]"
              :id="'input-ruolor'+index"
              type="text"
              placeholder=""
              disabled></b-form-input>
        </b-form-group>
      </span>
      <b-form-group id="input-group-1" label="Bibliografia:" label-for="funzione_form_view_input-bibliografia" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea
          id="funzione_form_view_input-bibliografia"
          v-model="form.bibliografia"
          type="text"
          disabled
          placeholder=""></b-form-textarea>
      </b-form-group>
      <b-form-group id="input-group-1" label="Schedatori:" label-for="funzione_form_view_input-schedatori" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea
          id="funzione_form_view_input-schedatori"
          v-model="form.schedatori_iniziali"
          type="text"
          disabled
          placeholder=""></b-form-textarea>
      </b-form-group>
      <b-form-group id="input-group-1" label="Note:" label-for="funzione_form_view_input-note" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea disabled id="funzione_form_view_input-note" v-model="form.note" type="text" placeholder=""></b-form-textarea>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import FunzioneFormToolTip from '@/components/ui/FunzioneFormToolTip'

// Renderizza il form per la visualizzazione di una funzione
export default {
  name: 'FormFunzioneLettura',
  components: { FunzioneFormToolTip },
  data () {
    return {}
  },
  props: {
    form: { type: Object, required: true }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
