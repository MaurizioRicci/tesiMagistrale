<template>
<div>
  <v-client-table ref="myTable" :columns="columns" v-model="tableData" :options="options"
  class="myTable table-sm" name="beniUtente">

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
                <icon-msg icon_name="check-circle" icon_msg="Analisi per approvazione"/>
            </b-button>

            <!-- sei revisore oppure se non sei revisore ma il bene non è sotto revisione -->
            <b-button v-if="cercaInArchivioTemp &&
              (sonoRevisore || !BeneModel.isRev.call(row))"
              @click="waitUserConfirmationDelete=true;rigaDaCancellare=row"
              key="cancellaTmp" variant="light" class="pt-1">
              <icon-msg icon_name="trash" icon_msg="Elimina" icon_color="red"/>
            </b-button>
          </b-button-group>
        </template>

        <div slot="msg_validatore" slot-scope="{row, update, setEditing, isEditing, revertValue}">
          <!-- class="d-inline-block w-100" da spessore per la modifica della cella
           anche se la cella ha come contenuto stringa vuota (utente appena aggiunto) -->
          <span v-if="!sonoRevisore">{{row.msg_validatore}}</span>
          <div v-else>
            <span @click="setEditing(true)" v-if="!isEditing()" key="msgValRead"
              style="cursor:pointer;">
              <a class="d-inline-block w-100">{{row.msg_validatore}}</a>
            </span>
            <span v-else key="msgValEdit">
                <b-form-textarea trim @input="msg => update(msg)"
                  placeholder="Messaggio per schedatore">
                </b-form-textarea>
                <b-button type="button" size="sm" variant="primary"
                  :disabled="row.msg_validatore === ''"
                  @click="update(row.msg_validatore); setEditing(false); inviaSegnalazione(row);">
                  Submit</b-button>
                <b-button type="button" size="sm"
                  @click="revertValue(); setEditing(false)">Cancel</b-button>
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

        <template slot="child_row" slot-scope="props">
        <b-button @click="() => openChildRow(props)" class="m-1">Mostra sulla mappa</b-button>
        <div v-if="currBeni[props.row.id]">
          <Map height="300px" v-if="!currBeni[props.row.id].form.polygon.isEmpty()"
            key="beneConGeometria" :center="currBeni[props.row.id].mapCenter"
            :polygon="currBeni[props.row.id].form.polygon" locked :zoom="17"/>
          <b-alert show variant="info" v-else key="beneSenzaGeometria" shown
            class="d-inline-block">
            Nessuna geometria trovata per il bene.
          </b-alert>
        </div>
      </template>

    </v-client-table>

    <b-toast id="confirm-toastDelete" title="Richiesta conferma" solid no-auto-hide
      toaster="b-toaster-bottom-center" variant="secondary" v-model="waitUserConfirmationDelete">
      <div class="row justify-content-center">
        <div class="col-12">
          <p>Eliminare bene?
          </p>
        </div>
        <div class="col-auto">
          <b-button variant="danger" @click="cancellaTmp(rigaDaCancellare)">Conferma</b-button>
        </div>
      </div>
    </b-toast>
</div>
</template>

<script>
import BeneModel from '@/assets/js/Models/beneModel'
import BeneTableMixin from '@/components/mixins/BeneTable'
import IconMsg from '@/components/ui/IconMsg'
import ellipsize from '@/assets/js/Filters/ellipsizeLongText'
import Map from '@/components/ui/Map'
import fetchBene from '@/assets/js/fetchBene'
// eslint-disable-next-line no-unused-vars
import { Event } from 'vue-tables-2'
import qs from 'qs'
import axios from 'axios'

// Beni Aggiunti o In Revisione, mostra i beni aggiunti dall'utente
// oppure quelli che ha in revisione
export default {
  name: 'BeniUtente',
  mixins: [BeneTableMixin],
  filters: { ellipsizeLongText: ellipsize },
  components: {
    IconMsg,
    Map
  },
  computed: {
    BeneModel: () => BeneModel(),
    sonoRevisore: function () {
      return this.$store.getters.getUserData.role === 'revisore'
    }
  },
  props: {
    cercaInArchivioTemp: Boolean,
    update: Boolean,
    caption: { type: String, default: 'Qua ci sono i beni utente che sono o in revisione, o da rivedere o che sono incompleti.' }
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
      return this.cercaInArchivioTemp ? [] : ['msg_validatore']
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
    },
    cancellaTmp (row) {
      let userData = this.$store.getters.getUserData
      let bene = { id: row.id, id_utente: row.id_utente }
      let postData = Object.assign({}, userData, bene)
      axios.post(this.$store.getters.cancellaBeneURL, qs.stringify(postData))
        .then(ok => {
          this.$vueEventBus.$emit('master-page-show-msg',
            ['Info', 'Bene temporaneo cancellato correttamente'])
          this.waitUserConfirmationDelete = true
          this.getData()
        })
    },
    openChildRow (data) {
      const row = data.row
      fetchBene(this, {
        'id': row.id,
        'tmp_db': true,
        'id_utente': row.id_utente
      }).then(resp => {
        this.$set(this.currBeni, row.id, resp)
      })
    }
  },
  data: function () {
    return {
      // dettagli aggiuntivi dei beni scelti (vedi Vue tables 2 Child Row)
      currBeni: { },
      // innesca la finestra di conferma eliminazione
      waitUserConfirmationDelete: false,
      // riga che l'utente vorrebbe cancellare
      rigaDaCancellare: {},
      columns: [
        'id',
        'status',
        'azioni',
        'identificazione',
        'descrizione',
        'macroEpocaOrig',
        'macroEpocaCar',
        'toponimo',
        'comune',
        'esistenza',
        'bibliografia',
        'note',
        'msg_validatore',
        'schedatori_iniziali'
      ],
      tableData: [],
      options: {
        saveState: true,
        storage: 'session',
        caption: this.caption,
        filterByColumn: true,
        sortable: [
          'id',
          'identificazione',
          'descrizione',
          'macroEpocaOrig',
          'macroEpocaCar',
          'toponimo',
          'comune',
          'esistenza',
          'bibliografia',
          'note',
          'msg_validatore',
          'schedatori_iniziali'
        ],
        filterAlgorithm: {
          id (row, query) {
            // se è solo un numero
            query = query.replace(' ', '')
            if (!isNaN(Number(query))) {
              return row.id === query
            } else {
              // se è un intervallo X-Y
              let lowerUpper = query.split('-')
              let res = true
              console.log(lowerUpper)
              if (lowerUpper.length > 0 && lowerUpper[0] !== '') {
                res &= Number(row.id) >= Number(lowerUpper[0])
              }
              if (lowerUpper.length > 1 && lowerUpper[1] !== '') {
                res &= Number(row.id) <= Number(lowerUpper[1])
              }
              return res
            }
          }
        },
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
        // evento update (da usare con .sync) per la proprietà update
        this.getData().then(() => this.$emit('update:update', false))
      }
    }
  }
}
</script>
