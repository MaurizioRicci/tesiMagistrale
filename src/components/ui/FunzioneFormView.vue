<template>
  <div>
    <FunzioneFormToolTip prefix="funzione_form_view_"/>
    <b-form :novalidate="true">
      <b-form-group id="input-group-1" label="ID bene:"
        label-for="funzione_form_view_input-id_bene" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <div @click="showBeneDetails(form.id_bene, form.id_utente_bene)"
          title="Click per dettagli sul bene">
          <b-form-input
            id="funzione_form_view_input-id_bene"
            class="id-bene"
            type="number"
            v-model="form.id_bene"
            disabled
            placeholder=""
            autocomplete="off"
            ></b-form-input>
        </div>
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
      <b-row>
        <b-col md="3" xl="2" class="col-form-label">
          <label>Data</label>
        </b-col>
        <b-col cols="12" md>
          <b-form-group id="input-group-1" label="Da:"
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
        </b-col>
        <b-col cols="12" md>
          <b-form-group id="input-group-1" label="A:"
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
        </b-col>
      </b-row>
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
      <ruoli-form-tag v-model="form.ruolo" label="Ruoli rif." disabled
        inputID="funzione_form_view_input-ruolor"/>
      <b-form-group id="input-group-1" label="Funzione:" label-for="funzione_form_view_input-funzione" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
        <b-form-input id="funzione_form_view_input-funzione" v-model="form.funzione" type="text" disabled placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="ID bene rif:" label-for="funzione_form_view_input-id_bener" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
        <div title="Click per dettagli sul bene" @click="showBeneDetails(form.id_bener, form.id_utente_bener)">
          <b-form-input class="id-bene" id="funzione_form_view_input-id_bener" v-model="form.id_bener" type="number" disabled placeholder=""></b-form-input>
        </div>
      </b-form-group>
      <b-form-group id="input-group-1" label="Denominazione rif:" label-for="funzione_form_view_input-denominazioner" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
        <b-form-input id="funzione_form_view_input-denominazioner" v-model="form.denominazioner" type="text" disabled placeholder=""></b-form-input>
      </b-form-group>
      <!-- ruolo 2 -->
      <ruoli-form-tag v-model="form.ruolor" label="Ruoli rif." disabled
        inputID="funzione_form_view_input-ruolo"/>
      <b-form-group id="input-group-1" label="Bibliografia:" label-for="funzione_form_view_input-bibliografia" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea
          id="funzione_form_view_input-bibliografia"
          v-model="form.bibliografia"
          type="text"
          disabled
          v-autoresize
          placeholder=""></b-form-textarea>
      </b-form-group>
      <b-form-group id="input-group-1" label="Schedatori:" label-for="funzione_form_view_input-schedatori" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea
          id="funzione_form_view_input-schedatori"
          v-model="form.schedatori_iniziali"
          type="text"
          disabled
          v-autoresize
          placeholder=""></b-form-textarea>
      </b-form-group>
      <b-form-group id="input-group-1" label="Note:" label-for="funzione_form_view_input-note" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea disabled id="funzione_form_view_input-note" v-autoresize
         v-model="form.note" type="text" placeholder=""></b-form-textarea>
      </b-form-group>
    </b-form>

    <b-modal id="modal-dettagli-bene" title="Dettagli Bene" size="xl" static hide-footer>
      <BeneOverview ref="beneOverview"/>
    </b-modal>

  </div>
</template>

<script>
import FunzioneFormToolTip from '@/components/ui/FunzioneFormToolTip'
import RuoliFormTag from '@/components/ui/RuoliFormTag'
import BeneOverview from '@/components/ui/BeneOverview'
import autoResize from '@/components/directives/autoResizeTextArea'

// Renderizza il form per la visualizzazione di una funzione
export default {
  name: 'FormFunzioneLettura',
  components: { FunzioneFormToolTip, RuoliFormTag, BeneOverview },
  directives: {
    autoresize: autoResize
  },
  data () {
    return {}
  },
  props: {
    form: { type: Object, required: true }
  },
  methods: {
    showBeneDetails (idBene, idUtente) {
      this.$refs.beneOverview.showBeneDetails(idBene, idUtente)
      this.$bvModal.show('modal-dettagli-bene')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#funzione_form_view_input-id_bene:hover, #funzione_form_view_input-id_bener:hover {
  border: solid 2px steelblue;
  cursor: pointer;
}
</style>
