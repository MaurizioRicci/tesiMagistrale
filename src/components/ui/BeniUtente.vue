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
          <span v-if="BeneModel.isRev.call(row)" class="text-light" key="inrevisione">
            In revisione</span>
          <span v-else-if="BeneModel.isIncorrect.call(row)" class="text-light" key="darivedere">
            Da rivedere</span>
          <span v-else-if="BeneModel.isIncomplete.call(row)" class="text-light" key="inbozza">
            Bozza</span>
          <span v-else-if="BeneModel.isReady.call(row)" class="text-light" key="pronto">
            Pronto per invio</span>
          </div>
        </template>

        <template v-slot:azioni="{row}">
          <b-button-group horizontal>
            <b-button v-if="cercaInArchivioTemp"
              key="siArchivioTmp" variant="light"
              :to="'/bene/dettagli_bene/' + row.id + '/' + row.id_utente"
             class="pt-1">
              <icon-msg icon_name="info-circle" icon_msg="Vedi dettagli"/>
            </b-button>

            <b-button v-else
              key="noArchivioTmp" variant="light"
              :to="'/bene/dettagli_bene/' + row.id"
             class="pt-1">
              <icon-msg icon_name="info-circle" icon_msg="Vedi dettagli"/>
            </b-button>

            <b-button :to="'/bene/modifica/' + row.id + '/' + row.id_utente"
              class="pt-1" key="nonRevisoreTmp" variant="light"
              v-if="cercaInArchivioTemp && !sonoRevisore &&
               (BeneModel.isIncomplete.call(row) || BeneModel.isIncorrect.call(row) ||
              BeneModel.isReady.call(row))">
                <icon-msg icon_name="edit" icon_msg="Modifica"/>
            </b-button>

            <b-button v-if="cercaInArchivioTemp && sonoRevisore"
              key="revisoreArchTmp" variant="light"
              :to="'/bene/valida/' + row.id + '/' + row.id_utente"
               class="pt-1">
                <icon-msg icon_name="check-circle" icon_msg="Approva con modifica"/>
            </b-button>

            <!-- sei revisore oppure se non sei revisore ma il bene non è sotto revisione -->
            <b-button v-if="cercaInArchivioTemp &&
              (sonoRevisore || !BeneModel.isRev.call(row))"
              @click="cancellaTmp(row)" key="cancellaTmp" variant="light" class="pt-1">
              <icon-msg icon_name="trash" icon_msg="Elimina" icon_color="red"/>
            </b-button>

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
import DettagliBene from '@/components/pages/Bene/ViewBene'
import EditBene from '@/components/pages/Bene/AddEditBene'
import BeneModel from '@/assets/js/Models/beneModel'
import '@/assets/css/hugeModal.css'
import BeneTableMixin from '@/components/mixins/BeneTable'
import IconMsg from '@/components/ui/IconMsg'
const qs = require('qs')
const axios = require('axios')

// Beni Aggiunti o In Revisione, mostra i beni aggiunti dall'utente
// oppure quelli che ha in revisione
export default {
  name: 'BeniUtente',
  mixins: [BeneTableMixin],
  components: {
    DettagliBene, EditBene, IconMsg
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
      this.$emit('loading')
      return axios.post(this.$store.getters.beniAggiuntiTempURL,
        qs.stringify({
          username: this.$store.getters.getUserData.username,
          password: this.$store.getters.getUserData.password,
          switch_bene: this.cercaInArchivioTemp ? 'miei_temp' : 'miei_aggiunti'
        })).then(resp => {
        this.$emit('loaded')
        this.tableData = resp.data
      }, fail => this.$emit('loadingFailed', fail.data))
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
    cancellaTmp (row) {
      let userData = this.$store.getters.getUserData
      let bene = {id: row.id, id_utente: row.id_utente}
      let postData = Object.assign({}, userData, bene)
      axios.post(this.$store.getters.cancellaBeneURL, qs.stringify(postData))
        .then(ok => {
          // se l'utente cancella il suo ultimo bene aggiorno lo stato interno dell'app
          if (Number(this.row.id) === this.$store.getters.beneUltimoID) {
            this.$store.commit('incrementaBeneUltimoID', -1)
          }
          this.$vueEventBus.$emit('master-page-show-msg',
            ['Info', 'Bene temporaneo cancellato correttamente'])
          this.getData()
        })
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
        headings: {
          macroEpocaCar: 'Mec',
          macroEpocaOrig: 'Meo'
        },
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
    update: function (val) {
      if (val) {
        this.getData().then(() => this.$emit('update:update', false))
      }
    }
  }
}
</script>

<style scoped>
    .myTable >>> table { table-layout: fixed; }
    .myTable >>> caption { caption-side: top; }
</style>
