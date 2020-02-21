<template>
<div>
  <v-client-table ref="myTable" :columns="columns" v-model="tableData" :options="options"
  class="myTable table-sm" name="funzioniUtente">

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
              key="siArchivioTmp" variant="light"
              :to="'/funzione/dettagli_funzione/' + row.id + '/' + row.id_utente"
             class="pt-1">
              <icon-msg icon_name="info-circle" icon_msg="Vedi dettagli"/>
            </b-button>

            <b-button v-if="!cercaInArchivioTemp"
              key="noArchivioTmp" variant="light"
              :to="'/funzione/dettagli_funzione/' + row.id"
             class="pt-1">
              <icon-msg icon_name="info-circle" icon_msg="Vedi dettagli"/>
            </b-button>

            <b-button :to="'/funzione/modifica/' + row.id + '/' + row.id_utente"
              class="pt-1" key="noRevisoreTmp" variant="light"
              v-if="cercaInArchivioTemp && !sonoRevisore &&
               (FunzioneModel.isIncomplete.call(row) || FunzioneModel.isIncorrect.call(row) ||
              FunzioneModel.isReady.call(row))">
                <icon-msg icon_name="edit" icon_msg="Modifica"/>
            </b-button>

            <div v-b-tooltip.hover :title="getApprovaBtnTxt(row)">
            <b-button v-if="cercaInArchivioTemp && sonoRevisore"
              :disabled="!funzioneApprovabile(row)"
              key="revisoreArchTmp" variant="light"
              :to="'/funzione/valida/' + row.id + '/' + row.id_utente"
               class="pt-1">
                <icon-msg icon_name="check-circle" icon_msg="Approva con modifica"/>
            </b-button>
            </div>

            <!-- sei revisore oppure se non sei revisore ma la funzione non è sotto revisione -->
            <b-button v-if="cercaInArchivioTemp && (sonoRevisore || !FunzioneModel.isRev.call(row))"
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

        <template v-slot:bibliografia="{row}">
          <!-- oltre i 50 caratteri (valore di default) tronco la stringa con i puntini -->
          {{row.bibliografia | ellipsizeLongText()}}
        </template>

        <template v-slot:note="{row}">
          <!-- oltre i 50 caratteri (valore di default) tronco la stringa con i puntini -->
          {{row.note | ellipsizeLongText()}}
        </template>

    </v-client-table>

</div>
</template>

<script>
import FunzioneModel from '@/assets/js/Models/funzioneModel'
import FunzioneTableMixin from '@/components/mixins/FunzioneTable'
import IconMsg from '@/components/ui/IconMsg'
import ellipsize from '@/assets/js/Filters/ellipsizeLongText'
import qs from 'qs'
import axios from 'axios'

// Beni Aggiunti o In Revisione, mostra i beni aggiunti dall'utente
// oppure quelli che ha in revisione
export default {
  name: 'FunzioniUtente',
  components: {
    IconMsg
  },
  mixins: [FunzioneTableMixin],
  filters: { ellipsizeLongText: ellipsize },
  computed: {
    FunzioneModel: () => FunzioneModel(),
    sonoRevisore: function () {
      return this.$store.getters.getUserData.role === 'revisore'
    }
  },
  props: {
    cercaInArchivioTemp: Boolean,
    update: Boolean,
    caption: { type: String, default: 'Qua ci sono le funzioni utente che sono o in revisione, o da rivedere o che sono incomplete.' }
  },
  methods: {
    getData: function () {
      this.$emit('loading')
      return axios.post(this.$store.getters.funzioniAggiunteTempURL,
        qs.stringify({
          username: this.$store.getters.getUserData.username,
          password: this.$store.getters.getUserData.password,
          switch_funzione: this.cercaInArchivioTemp ? 'miei_temp' : 'miei_aggiunti'
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
      if (!this.FunzioneModel.isRev.call(row)) {
        this.$vueEventBus.$emit('master-page-show-msg',
          ['Errore', 'Puoi segnalare solo le funzioni in revisione'])
        return
      }
      let postData = Object.assign(row, this.$store.getters.getUserData)
      axios.post(this.$store.getters.segnalaFunzioneURL, qs.stringify(postData))
        .then(ok => this.$vueEventBus.$emit('master-page-show-msg',
          ['Info', 'Funzione segnalata correttamente']))
    },
    cancellaTmp (row) {
      let userData = this.$store.getters.getUserData
      let funzione = { id: row.id, id_utente: row.id_utente }
      let postData = Object.assign({}, userData, funzione)
      axios.post(this.$store.getters.cancellaFunzioneURL, qs.stringify(postData))
        .then(ok => {
          this.$vueEventBus.$emit('master-page-show-msg',
            ['Info', 'Funzione temporanea cancellata correttamente'])
          this.getData()
        })
    },
    funzioneApprovabile (row) {
      return row.bene_approvato === 't' && row.bener_approvato === 't'
    },
    getApprovaBtnTxt (row) {
      let beniDaApprovare = []
      if (row.bene_approvato !== 't') beniDaApprovare.push(row.id_bene)
      if (row.bener_approvato !== 't') beniDaApprovare.push(row.id_bener)
      return this.funzioneApprovabile(row) ? ''
        : 'Devi prima approvare i seguenti beni: ' + beniDaApprovare.join(',')
    }
  },
  data: function () {
    return {
      columns: [
        'id',
        'status',
        'azioni',
        'data_ante',
        'data_poste',
        'tipodata',
        'id_bene',
        'denominazione',
        'ruolo',
        'funzione',
        'id_bener',
        'denominazioner',
        'ruolor',
        'bibliografia',
        'note',
        'schedatori_iniziali',
        'msg_validatore'
      ],
      tableData: [],
      options: {
        saveState: true,
        storage: 'session',
        caption: this.caption,
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
  .myTable >>> caption { caption-side: top; }
</style>
