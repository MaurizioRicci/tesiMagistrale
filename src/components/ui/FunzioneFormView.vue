<template>
  <div>
    <FunzioneFormToolTip prefix="funzione_form_view_"/>
    <b-form :novalidate="true">
      <b-form-group id="input-group-1" label="ID bene:"
        label-for="funzione_form_view_input-id_bene" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <div @click="showBeneDetails(form.id_bene, form.id_utente_bene)"
          style="cursor:'pointer'">
          <b-form-input
            id="funzione_form_view_input-id_bene"
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
      <ruoli-form-tag v-model="form.ruolo" label="Ruoli rif." disabled
        inputID="funzione_form_view_input-ruolor"/>
      <b-form-group id="input-group-1" label="Funzione:" label-for="funzione_form_view_input-funzione" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
        <b-form-input id="funzione_form_view_input-funzione" v-model="form.funzione" type="text" disabled placeholder=""></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="ID bene rif:" label-for="funzione_form_view_input-id_bener" label-cols-sm="6"
        label-cols-md="3" label-cols-xl="2">
        <div @click="showBeneDetails(form.id_bener, form.id_utente_bener)">
          <b-form-input id="funzione_form_view_input-id_bener" v-model="form.id_bener" type="number" disabled placeholder=""></b-form-input>
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

    <b-modal id="modal-dettagli-bene" title="Dettagli Bene"
      size="huge" hide-footer @shown="$refs.myMap.invalidateSize()">
    <div role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-1 variant="info">Mappa</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="accordion-bene-details" role="tabpanel">
          <b-card-body>
            <MyMap ref="myMap" :polygon="beneData.form.polygon"
             :center="beneData.mapCenter" locked :zoom="17"/>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-2 variant="info">Attributi</b-button>
        </b-card-header>
        <b-collapse id="accordion-2" accordion="accordion-bene-details" role="tabpanel">
          <b-card-body>
            <BeneFormView v-if="beneData" :form="beneData.form" disallowIDChange/>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
    </b-modal>

  </div>
</template>

<script>
import FunzioneFormToolTip from '@/components/ui/FunzioneFormToolTip'
import RuoliFormTag from '@/components/ui/RuoliFormTag'
import BeneFormView from '@/components/ui/BeneFormView'
import fetchBene from '@/assets/js/fetchBene'
import MyMap from '@/components/ui/Map'
import getBeneModel from '@/assets/js/Models/beneModel'
import '@/assets/styles/hugeModal.css'

// Renderizza il form per la visualizzazione di una funzione
export default {
  name: 'FormFunzioneLettura',
  components: { FunzioneFormToolTip, RuoliFormTag, BeneFormView, MyMap },
  data () {
    return {
      beneData: { form: getBeneModel(), mapCenter: [0, 0] }
    }
  },
  props: {
    form: { type: Object, required: true }
  },
  methods: {
    showBeneDetails (idBene, idUtenteBene) {
      let postData = {
        'id': idBene,
        'id_utente': idUtenteBene,
        'tmp_db': idUtenteBene !== ''
      }
      console.log('fetchBene')
      fetchBene(this, postData)
        .then(data => {
          this.beneData = data
          this.$bvModal.show('modal-dettagli-bene')
          this.$nextTick(() => {
            this.$refs.myMap.invalidateSize()
          })
        })
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
