<template>
  <div>
    <FunzioneFormToolTip/>
    <b-form :novalidate="true" :validated="validated" ref="form_bene">
      <b-form-checkbox @change="checked => checked ? form.setIncomplete() : form.setReady()"
        :checked="form.isIncomplete()"
        name="check-button-bozza" switch v-if="!noDraft"
        id="checkbox-bozza" size="lg" class="mb-1">
        Aggiungi alle bozze
      </b-form-checkbox>
      <!-- id bene 1 -->
      <b-form-group id="input-group-id" label="ID:" label-for="input-id_bene"
       label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-id_bene"
          v-model="form.id_bene"
          type="number"
          required
          placeholder="">
        </b-form-input>
      </b-form-group>
      <!-- denominazione -->
      <b-form-group id="input-group-1" label="Denominazione:"
        label-for="input-denominazione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
          <b-form-input
            id="input-denominazione"
            type="text"
            v-model="form.denominazione"
            placeholder=""
            autocomplete="off"
            ></b-form-input>
      </b-form-group>
      <!-- data -->
      <b-form-group id="input-group-1" label="Data:"
        label-for="input-data" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-data"
          type="text"
          v-model="form.data"
          placeholder=""
          autocomplete="off"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Data anteriore:"
        label-for="input-data_ante" label-cols-sm="6" label-cols-md="3" label-cols-xl="2"
        :state="dataAnteValida" invalid-feedback="Data invalida">
        <b-form-input
          id="input-data_ante"
          type="text"
          v-model="form.data_ante"
          placeholder=""
          autocomplete="off"
          v-setcustomvalidity="dataAnteValida"
          ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-1" label="Data posteriore:"
        label-for="input-data_poste" label-cols-sm="6" label-cols-md="3" label-cols-xl="2"
        :state="dataPosteValida" invalid-feedback="Data invalida">
        <b-form-input
          id="input-data_poste"
          type="text"
          v-model="form.data_poste"
          placeholder=""
          autocomplete="off"
          v-setcustomvalidity="dataPosteValida"
          ></b-form-input>
      </b-form-group>
      <!-- tipo data -->
      <b-form-group id="input-group-1" label="Tipo data:"
        label-for="input-tipodata" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
      <my-autocomplete-input v-model="form.tipodata" closedDictionary
        icon_name="lock" icon_msg="Campo vincolato a un dizionario"
        :suggestionsPromise="getDictFuncs().loadTipoData"
        invalid-feedback="Tipo data non corretto">
          <b-form-input
            id="input-tipodata"
            type="text"
            v-model="form.tipodata"
            placeholder=""
            autocomplete="off"
            ></b-form-input>
          </my-autocomplete-input>
      </b-form-group>
      <!-- ruolo -->
      <!-- @change="val => $set(this.form, 'ruolo', val)" -->
      <span id="input_ruolo" v-for="(ruolo, index) in form.ruolo" :key="'ruolo'+index">
        <b-form-group id="input-group-1" label="Ruolo:"
          :label-for="'input-ruolo'+index" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
          <my-autocomplete-input v-model="form.ruolo[index]" closedDictionary
            icon_name="lock" icon_msg="Campo vincolato a un dizionario"
            :suggestionsPromise="getDictFuncs().loadRuolo">
            <b-form-input
              v-model="form.ruolo[index]"
              :id="'input-ruolo'+index"
              type="text"
              placeholder=""
              autocomplete="off"></b-form-input>
          </my-autocomplete-input>
          <IconMsg icon_name="minus-square" icon_msg="Rimuovi ruolo"
            @click="removeRole('ruolo', index)"/>
          <IconMsg icon_name="plus-square" icon_msg="Aggiungi ruolo"
            @click="addRole('ruolo')"/>
        </b-form-group>
      </span>
      <!-- funzione -->
      <b-form-group id="input-group-1" label="Funzione:"
        label-for="input-funzione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <my-autocomplete-input v-model="form.funzione" closedDictionary
          icon_name="lock" icon_msg="Campo vincolato a un dizionario"
          :suggestionsPromise="getDictFuncs().loadTipoData">
          <b-form-input
            v-model="form.funzione"
            id="input-funzione"
            type="text"
            placeholder=""
            autocomplete="off"
            ></b-form-input>
        </my-autocomplete-input>
      </b-form-group>
      <!-- id bene 2 -->
      <b-form-group id="input-group-id_bener" label="ID rif:" label-for="input-id_bener"
       label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-input
          id="input-id_bener"
          v-model="form.id_bener"
          type="number"
          required
          placeholder="">
        </b-form-input>
      </b-form-group>
      <!-- denominazione2 -->
      <b-form-group id="input-group-1" label="Denominazione rif:"
        label-for="input-denominazioner" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
          <b-form-input
            id="input-denominazioner"
            type="text"
            v-model="form.denominazioner"
            placeholder=""
            autocomplete="off"
            ></b-form-input>
      </b-form-group>
      <!-- ruolo2 -->
      <span id="input_ruolor" v-for="(ruolor, index) in form.ruolor" :key="'ruolor'+index">
        <b-form-group id="input-group-1" label="Ruolo rif:"
          :label-for="'input-ruolor'+index" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
          <my-autocomplete-input v-model="form.ruolor[index]" closedDictionary
            icon_name="lock" icon_msg="Campo vincolato a un dizionario"
            :suggestionsPromise="getDictFuncs().loadRuolo">
            <b-form-input
              v-model="form.ruolor[index]"
              :id="'input-ruolor'+index"
              type="text"
              placeholder=""
              autocomplete="off"></b-form-input>
          </my-autocomplete-input>
          <IconMsg icon_name="minus-square" icon_msg="Rimuovi ruolo"
            @click="removeRole('ruolor', index)"/>
          <IconMsg icon_name="plus-square" icon_msg="Aggiungi ruolo"
            @click="addRole('ruolor')"/>
        </b-form-group>
      </span>
      <!-- bibliografia -->
      <b-form-group id="input-group-1" label="Bibliografia:" label-for="input-bibliografia" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea
          id="input-bibliografia"
          v-model="form.bibliografia"
          type="text"
          placeholder=""></b-form-textarea>
      </b-form-group>
      <!-- note -->
      <b-form-group id="input-group-1" label="Note:" label-for="input-note" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea id="input-note" v-model="form.note" type="text" placeholder=""></b-form-textarea>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import setCustomValidity from '@/components/directives/setCustomValidity'
import FunzioneFormToolTip from '@/components/ui/FunzioneFormToolTip'
import MyAutocompleteInput from '@/components/ui/MyAutocompleteInput'
import RemoteContextualSuggestions from '@/components/common/RemoteContextualSuggestions'
import IconMsg from '@/components/ui/IconMsg'
import * as dict from '@/assets/js/loadDict'
import { dataVera } from '@/assets/js/date/dateF'

// Renderizza il form per la aggiunta/modifica di una funzione
export default {
  name: 'FormBeneLeggiScrivi',
  components: {
    FunzioneFormToolTip,
    MyAutocompleteInput,
    RemoteContextualSuggestions,
    IconMsg
  },
  mixins: [],
  directives: {
    setcustomvalidity: setCustomValidity
  },
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
    checkValidity () { return this.$refs.form_bene.checkValidity() },
    removeRole (key, index) {
      if (index > 0) {
        this.form[key] = this.form[key].filter((val, idx) => idx !== index)
      }
    },
    addRole (key) {
      this.form[key].push('')
    }
  },
  computed: {
    dataAnteValida () { return dataVera(this.form.data_ante) },
    dataPosteValida () { return dataVera(this.form.data_poste) }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
