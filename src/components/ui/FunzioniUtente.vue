<template>
<div>
  <v-client-table ref="myTable" :columns="columns" v-model="tableData" :options="options">

        <template v-slot:status="{row}">
          <div :class="{
            'bg-warning': FunzioneModel.isIncomplete.call(row),
            'bg-danger': FunzioneModel.isIncorrect.call(row),
            'bg-success': FunzioneModel.isReady.call(row),
            'bg-info': FunzioneModel.isRev.call(row)
            }" class="mt-1 rounded">
          <span v-if="FunzioneModel.isRev.call(row)" class="text-light" key="inrevisione">
            In revisione</span>
          <span v-else-if="FunzioneModel.isIncorrect.call(row)" class="text-light" key="darivedere">
            Da rivedere</span>
          <span v-else-if="FunzioneModel.isIncomplete.call(row)" class="text-light" key="inbozza">
            Bozza</span>
          <span v-else-if="FunzioneModel.isReady.call(row)" class="text-light" key="pronto">
            Pronto per invio</span>
          </div>
        </template>

        <template v-slot:ruolo="{row}">
          <!-- e' un array di ruoli, li separo con virgola -->
          {{JSON.parse(row.ruolo).join(',')}}
        </template>

          <template v-slot:ruolor="{row}">
          <!-- e' un array di ruoli, li separo con virgola -->
          {{JSON.parse(row.ruolor).join(',')}}
        </template>

        <template v-slot:azioni="{row}">
          <b-button-group horizontal>
            <b-button v-if="cercaInArchivioTemp"
              key="siArchivioTmp"
              :to="'/funzione/dettagli_funzione/' + row.id + '/' + row.id_utente"
             class="pt-1">Vedi dettagli</b-button>

            <b-button v-if="!cercaInArchivioTemp"
              key="noArchivioTmp"
              :to="'/funzione/dettagli_funzione/' + row.id"
             class="pt-1">Vedi dettagli</b-button>

            <b-button :to="'/funzione/modifica/' + row.id + '/' + row.id_utente"
              class="pt-1" key="noRevisoreTmp"
              v-if="cercaInArchivioTemp && !sonoRevisore &&
               (FunzioneModel.isIncomplete.call(row) || FunzioneModel.isIncorrect.call(row) ||
              FunzioneModel.isReady.call(row))">Modifica</b-button>

            <b-button v-if="cercaInArchivioTemp && sonoRevisore"
              key="revisoreArchTmp"
              :to="'/funzione/valida/' + row.id + '/' + row.id_utente"
               class="pt-1">Modifica e approva</b-button>

          </b-button-group>
        </template>

        <div slot="msg_validatore" slot-scope="{row, update, setEditing, isEditing, revertValue}">
          <!-- class="d-inline-block w-100" da spessore per la modifica della cella
           anche se la cella ha come contenuto stringa vuota (utente appena aggiunto) -->
          <span v-if="!sonoRevisore">{{row.msg_validatore}}</span>
          <div v-else>
            <span @click="setEditing(true)" v-if="!isEditing()">
              <a class="d-inline-block w-100">{{row.msg_validatore}}</a>
            </span>
            <span v-else>
                <input type="text" v-model="row.msg_validatore">
                <b-button type="button" class="btn btn-info btn-xs"
                  @click="update(row.msg_validatore); setEditing(false); inviaSegnalazione(row);">
                  Submit</b-button>
                <button type="button" class="btn btn-default btn-xs"
                  @click="revertValue(); setEditing(false)">Cancel</button>
            </span>
          </div>
        </div>

    </v-client-table>

</div>
</template>

<script>
import DettagliFunzione from '@/components/pages/Funzione/ViewFunzione'
import EditBene from '@/components/pages/Bene/AddEditBene'
import FunzioneModel from '@/assets/js/Models/funzioneModel'
import '@/assets/css/hugeModal.css'
import {loadRuolo, loadTipoData, loadFunc} from '@/assets/js/loadDict'
const qs = require('qs')
const axios = require('axios')

// Beni Aggiunti o In Revisione, mostra i beni aggiunti dall'utente
// oppure quelli che ha in revisione
export default {
  name: 'BeniUtente',
  components: {
    DettagliFunzione,
    EditBene
  },
  computed: {
    FunzioneModel: () => FunzioneModel(),
    sonoRevisore: function () {
      return this.$store.getters.getUserData.role === 'revisore'
    }
  },
  props: {
    cercaInArchivioTemp: Boolean,
    update: Boolean
  },
  methods: {
    getData: function () {
      return axios.post(this.$store.getters.funzioniAggiunteTempURL,
        qs.stringify({
          username: this.$store.getters.getUserData.username,
          password: this.$store.getters.getUserData.password,
          switch_funzione: this.cercaInArchivioTemp ? 'miei_temp' : 'miei_aggiunti'
        })).then(function (resp) { this.tableData = resp.data }.bind(this))
    },
    getHiddenColums () {
      // nasconde la colonna msg_validatore se si chiedono i beni approvati dell'utente
      let res = []
      if (this.cercaInArchivioTemp) res = []
      else res = ['msg_validatore']
      return res
    },
    inviaSegnalazione (row) {
      if (!this.FunzioneModel.isRev.call(row)) {
        this.$vueEventBus.$emit('master-page-show-msg',
          ['Errore', 'Puoi segnalare solo le funzioni in revisione'])
        return
      }
      let postData = Object.assign(row, this.$store.getters.getUserData)
      axios.post(this.$store.getters.segnalaBeneURL, qs.stringify(postData))
        .then(ok => this.$vueEventBus.$emit('master-page-show-msg',
          ['Info', 'Funzione segnalata correttamente']))
        .catch(error => {
          let msg = (error.response && error.response.data.msg) || error.message
          this.$vueEventBus.$emit('master-page-show-msg',
            ['Errore', msg])
        })
    },
    getRuolo: function () {
      return loadRuolo(this)
        .then(resp => resp.data.map(el => { return {id: el.id, text: el.value} }))
    },
    getTipoData: function () {
      return loadTipoData(this)
        .then(resp => resp.data.map(el => { return {id: el.id, text: el.value} }))
    },
    getFunc: function () {
      return loadFunc(this)
        .then(resp => resp.data.map(el => { return {id: el.id, text: el.value} }))
    }
  },
  data: function () {
    return {
      idBene: '',
      idUtente: '',
      modalShowView: false,
      modalShowEdit: false,
      columns: [
        'id',
        'status',
        // visible: this.cercaInArchivioTemp
        'azioni',
        'denominazione',
        'denominazioner',
        'data',
        'tipodata',
        'funzione',
        'id_bene',
        'id_utente_bene',
        'ruolo',
        'id_bener',
        'id_utente_bener',
        'ruolor',
        'bibliografia',
        'note',
        'schedatori_iniziali'
      ],
      tableData: [],
      options: {
        filterable: [
          'id',
          'status',
          'denominazione',
          'denominazioner',
          'data',
          'tipodata',
          'funzione',
          'id_bene',
          'id_utente_bene',
          'ruolo',
          'id_bener',
          'id_utente_bener',
          'ruolor',
          'bibliografia',
          'note',
          'schedatori_iniziali'
        ],
        filterByColumn: true,
        editableColumns: ['msg_validatore'],
        hiddenColumns: this.getHiddenColums(),
        listColumns: {
          status: [
            {id: 0, text: 'In revisione'},
            {id: 1, text: 'Da rivedere'},
            {id: 2, text: 'Pronto per invio'},
            {id: 3, text: 'Bozza'}
          ],
          tipodata: [],
          ruolo: [],
          ruolor: [],
          funzione: []
        }
      }
    }
  },
  mounted () {
    this.getData()
    this.getRuolo().then(arr => {
      this.options.listColumns.ruolo = arr
      this.options.listColumns.ruolor = arr
    })
    this.getTipoData().then(arr => { this.options.listColumns.tipodata = arr })
    this.getFunc().then(arr => { this.options.listColumns.funzione = arr })
  },
  watch: {
    update: function (val) { this.getData() }
  }
}
</script>

<style scoped>
    .myTable >>> table { table-layout: fixed; }
    .myTable >>> caption { caption-side: top; }
</style>
