<template>
<div>
  <v-client-table ref="myTable" :columns="columns" v-model="tableData" :options="options">

        <template v-slot:status="{row}">
          <div :class="{
            'bg-warning': BeneModel.isIncomplete.call(row),
            'bg-danger': BeneModel.isIncorrect.call(row),
            'bg-success': BeneModel.isReady.call(row),
            'bg-info': BeneModel.isRev.call(row)
            }" class="mt-1 rounded">
          <span v-if="BeneModel.isRev.call(row)" class="text-light">In revisione</span>
          <span v-else-if="BeneModel.isIncorrect.call(row)" class="text-light">Da rivedere</span>
          <span v-else-if="BeneModel.isIncomplete.call(row)" class="text-light">Bozza</span>
          <span v-else-if="BeneModel.isReady.call(row)" class="text-light">Pronto per invio</span>
          </div>
        </template>

        <template v-slot:azioni="{row}">
          <b-button-group vertical>
            <b-button :to="'/bene/dettagli_bene/' + row.id + '/' + row.id_utente"
             class="pt-1">Vedi dettagli</b-button>

            <b-button :to="'/bene/modifica/' + row.id + '/' + row.id_utente"
              class="pt-1"
              v-if="!sonoRevisore && (BeneModel.isIncomplete.call(row) || BeneModel.isIncorrect.call(row) ||
              BeneModel.isReady.call(row))">Modifica</b-button>

            <b-button v-if="sonoRevisore" :to="'/bene/modifica/' + row.id + '/' + row.id_utente"
               class="pt-1">Modifica e approva</b-button>
            <b-button v-if="sonoRevisore" @click="approvaBene(row)">Approva</b-button>

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
                  @click="update(row.msg_validatore); setEditing(false); inviaSegnalazione(row);">Submit</b-button>
                <button type="button" class="btn btn-default btn-xs"
                  @click="revertValue(); setEditing(false)">Cancel</button>
            </span>
          </div>
        </div>

    </v-client-table>

</div>
</template>

<script>
import DettagliBene from '@/components/pages/Bene/ViewBene'
import EditBene from '@/components/pages/Bene/AddEditBene'
import BeneModel from '@/assets/js/Models/beneModel'
import '@/assets/css/hugeModal.css'
const qs = require('qs')
const axios = require('axios')

// Beni Aggiunti o In Revisione, mostra i beni aggiunti dall'utente
// oppure quelli che ha in revisione
export default {
  name: 'BeniUtente',
  components: {
    DettagliBene: DettagliBene,
    EditBene: EditBene
  },
  computed: {
    BeneModel: () => BeneModel(),
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
      return axios.post(this.$store.getters.beniAggiuntiTempURL,
        qs.stringify({
          username: this.$store.getters.getUserData.username,
          password: this.$store.getters.getUserData.password,
          switch_bene: this.cercaInArchivioTemp ? 'miei_temp' : 'miei_aggiunti'
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
      if (!this.BeneModel.isRev.call(row)) {
        this.$vueEventBus.$emit('master-page-show-msg',
          ['Errore', 'Puoi segnalare solo i beni in revisione'])
        return
      }
      let postData = Object.assign(row, this.$store.getters.getUserData)
      axios.post(this.$store.getters.segnalaBeneURL, qs.stringify(postData))
        .then(ok => this.$vueEventBus.$emit('master-page-show-msg',
          ['Info', 'Bene segnalato correttamente']))
        .catch(error => {
          let msg = (error.response && error.response.data.msg) || error.message
          this.$vueEventBus.$emit('master-page-show-msg',
            ['Errore', msg])
        })
    },
    approvaBene (row) {
      let postData = Object.assign(row, this.$store.getters.getUserData)
      axios.post(this.$store.getters.approvaBeneURL, qs.stringify(postData))
        .then(ok => this.$vueEventBus.$emit('master-page-show-msg',
          ['Info', 'Bene approvato correttamente']))
        .catch(error => {
          let msg = (error.response && error.response.data.msg) || error.message
          this.$vueEventBus.$emit('master-page-show-msg',
            ['Errore', msg])
        })
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
        'identificazione',
        'descrizione',
        'comune',
        'macroEpocaCar',
        'macroEpocaOrig',
        'bibliografia',
        'note',
        'toponimo',
        'msg_validatore'
      ],
      tableData: [],
      options: {
        filterable: true,
        filterByColumn: true,
        editableColumns: ['msg_validatore'],
        hiddenColumns: this.getHiddenColums()
      }
    }
  },
  mounted () {
    this.getData()
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
