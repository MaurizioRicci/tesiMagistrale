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
       label-cols-sm="6" label-cols-md="3" label-cols-xl="2" class="required-field"
       invalid-feedback="ID bene non trovato"
       :state="beneOk">
        <b-form-input
          class="id-bene"
          id="input-id_bene"
          v-model="form.id_bene"
          type="number"
          min="1"
          required
          placeholder=""
          @input="debounceF1"
          v-setcustomvalidity="beneOk">
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
      <b-row>
        <b-col md="3" xl="2" class="col-form-label">
          <label>Data</label>
        </b-col>
        <b-col cols="12" md>
          <b-form-group id="input-group-1" label="Da:"
            label-for="input-data_ante" label-cols="2" label-cols-sm="6"
            label-cols-md="3" label-cols-xl="2"
            :state="dataAnteValida">
            <b-form-input
              id="input-data_ante"
              type="text"
              v-model="form.data_ante"
              placeholder=""
              autocomplete="off"
              v-setcustomvalidity="dataAnteValida"
              ></b-form-input>
              <b-form-invalid-feedback :state="dataAnteValida">
                <span id="data_ante-help">Data invalida. Vedi date supportate</span>
              </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col cols="12" md>
          <b-form-group id="input-group-1" label="A:"
            label-for="input-data_poste" label-cols="2" label-cols-sm="6"
            label-cols-md="3" label-cols-xl="2"
            :state="dataPosteValida">
            <b-form-input
              id="input-data_poste"
              type="text"
              v-model="form.data_poste"
              placeholder=""
              autocomplete="off"
              v-setcustomvalidity="dataPosteValida"
              ></b-form-input>
              <b-form-invalid-feedback :state="dataPosteValida">
                <span id="data_poste-help">Data invalida. Vedi date supportate</span>
              </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <!-- tipo data -->
      <b-form-group id="input-group-1" label="Tipo data:"
        label-for="input-tipodata" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-select id="input-tipodata" v-model="form.tipodata"
         :options="tipoDataOptions"></b-form-select>
      </b-form-group>
      <!-- ruolo -->
      <ruoli-form-tag v-model="form.ruolo" label="Ruoli" inputID="input-ruolo"/>
      <!-- funzione -->
      <b-form-group id="input-group-1" label="Funzione:"
        label-for="input-funzione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2"
        class="required-field">
        <b-form-select id="input-funzione" v-model="form.funzione"
         :options="funzioneOptions" required></b-form-select>
      </b-form-group>
      <!-- id bene 2 -->
      <b-form-group id="input-group-id_bener" label="ID rif:" label-for="input-id_bener"
       label-cols-sm="6" label-cols-md="3" label-cols-xl="2"
       invalid-feedback="ID bene di riferimento non trovato"
       :state="benerOk">
        <b-form-input
          class="id-bene"
          id="input-id_bener"
          v-model="form.id_bener"
          type="number"
          min="1"
          placeholder=""
          v-setcustomvalidity="benerOk"
          @input="debounceF2">
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
      <ruoli-form-tag v-model="form.ruolor" label="Ruoli rif." inputID="input-ruolor"/>
      <!-- bibliografia -->
      <b-form-group id="input-group-1" label="Bibliografia:" label-for="input-bibliografia" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea
          id="input-bibliografia"
          v-model="form.bibliografia"
          type="text"
          v-autoresize
          placeholder=""></b-form-textarea>
      </b-form-group>
      <!-- note -->
      <b-form-group id="input-group-1" label="Note:" label-for="input-note" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
        <b-form-textarea id="input-note" v-model="form.note" v-autoresize
         type="text" placeholder=""></b-form-textarea>
      </b-form-group>
    </b-form>
    <HelpDate target="data_ante-help"/>
    <HelpDate target="data_poste-help"/>
  </div>
</template>

<script>
import setCustomValidity from '@/components/directives/setCustomValidity'
import FunzioneFormToolTip from '@/components/ui/FunzioneFormToolTip'
import RuoliFormTag from '@/components/ui/RuoliFormTag'
import HelpDate from '@/components/ui/HelpDate'
import * as dict from '@/assets/js/loadDict'
import { dataVera } from '@/assets/js/date/dateF'
import autoResize from '@/components/directives/autoResizeTextArea'
import fetchBene from '@/assets/js/fetchBene'
import debounce from '@/assets/js/asyncDebounceFunction'

// Renderizza il form per la aggiunta/modifica di una funzione
export default {
  name: 'FormFunzioneLeggiScrivi',
  components: {
    FunzioneFormToolTip,
    RuoliFormTag,
    HelpDate
  },
  mixins: [],
  directives: {
    setcustomvalidity: setCustomValidity,
    autoresize: autoResize
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
  data () {
    return {
      tipoDataOptions: [],
      funzioneOptions: [],
      esistenzaOptions: [],
      // contiene lo stato per la debounced function per il controllo di id bene
      debounceF1: function () {},
      // contiene lo stato per la debounced function per il controllo di id bener
      debounceF2: function () {},
      // vero se id bene scritto è corretto
      beneOk: null,
      // vero se id bener di riferimento scritto è corretto
      benerOk: null
    }
  },
  methods: {
    getDictFuncs () { return dict },
    // @vuese
    // dice se il form è valido
    checkValidity () {
      return this.$refs.form_bene.checkValidity() &&
        (this.beneOk || this.benerOk)
    },
    dict2BsSelect (dict) {
      let options = [{ value: '', text: 'Seleziona un\'opzione' }]
      return options.concat(dict.map(el => {
        return { value: el.id, text: el.value }
      }))
    },
    getTipoDataOptions () {
      return dict.loadTipoData(this)
        .then(res => this.dict2BsSelect(res.data))
    },
    getFunzioneOptions () {
      return dict.loadFunc(this)
        .then(res => this.dict2BsSelect(res.data))
    },
    async checkIDBene (idBene, idUtente, switchBene) {
      console.log('check id')
      let assignVal = (switchBene, val) => {
        if (switchBene === 'bene') this.beneOk = val
        else this.benerOk = val
      }
      if (idBene === '') {
        assignVal(switchBene, null)
      } else {
        const paramsBeneDef = { 'id': idBene, 'tmp_db': false }
        const paramsBeneTmp = { 'id': idBene, 'tmp_db': true, 'id_Utente': idUtente }
        try {
          // se fetchBene da un errore (es: id del bene un intero troppo lungo) si interrompe tutto
          const resp1 = await fetchBene(this, paramsBeneDef)
          // !!resp poichè controlla che non sia ne null ne undefined
          if (resp1) assignVal(switchBene, !!resp1)
          else {
            const resp2 = await fetchBene(this, paramsBeneTmp)
            assignVal(switchBene, !!resp2)
          }
        } catch (error) {
          assignVal(switchBene, false)
        }
      }
    }
  },
  computed: {
    dataAnteValida () { return dataVera(this.form.data_ante) },
    dataPosteValida () { return dataVera(this.form.data_poste) }
  },
  mounted () {
    this.getTipoDataOptions().then(options => { this.tipoDataOptions = options })
    this.getFunzioneOptions().then(options => { this.funzioneOptions = options })
    // inizializzo le debounced function
    this.debounceF1 = debounce(() => this.checkIDBene(this.form.id_bene, this.form.id_utente_bene, 'bene'), 2000)
    this.debounceF2 = debounce(() => this.checkIDBene(this.form.id_bener, this.form.id_utente_bener, 'bener'), 2000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
