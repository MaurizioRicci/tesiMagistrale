<template>
<div>
  <v-server-table :columns="columns" :options="options" class="myTable table-sm" ref="myTable"
    :url="$store.getters.beniAggiuntiApprovatiURL" name="ricercaBeniApprovati"
    @click="e => openChildRow(e)" @filter="updateFiltersCount('myTable')">
        <template v-slot:beforeTable>
          <h5 style="margin-bottom:-1em;">Numero di filtri applicati
            <b-badge variant="info">{{filtersCount}}</b-badge></h5>
        </template>
        <template v-slot:azioni="{row}">
          <b-button-group horizontal>
            <b-button :to="'/bene/dettagli_bene/'.concat(row.id)" class="pt-1"
              variant="light">
              <icon-msg icon_name="info-circle" icon_msg="Vedi dettagli"/>
            </b-button>
            <b-button :to="'/bene/modifica/'.concat(row.id)" row.id class="pt-1"
              variant="light">
              <icon-msg icon_name="edit" icon_msg="Modifica"/>
            </b-button>
            <b-button v-if="sonoRevisore"
              @click="waitUserConfirmationDelete=true;rigaDaCancellare=row"
              key="cancellaDef" variant="light" class="pt-1">
              <icon-msg icon_name="trash" icon_msg="Elimina" icon_color="red"/>
            </b-button>
          </b-button-group>
        </template>

      <template v-slot:bibliografia="{row}">
        <!-- oltre i 50 caratteri (valore di default) tronco la stringa con i puntini -->
        <span :title="row.bibliografia">{{row.bibliografia | ellipsizeLongText()}}</span>
      </template>

      <template v-slot:note="{row}">
        <!-- oltre i 50 caratteri (valore di default) tronco la stringa con i puntini -->
        <span :title="row.note">{{row.note | ellipsizeLongText()}}</span>
      </template>

      <template slot="child_row" slot-scope="props">
       <b-button @click="() => openChildRow(props)" class="m-1">Mostra sulla mappa</b-button>
        <Map height="300px" v-if="currBeni[props.row.id]"
          :center="currBeni[props.row.id].mapCenter"
          :polygon="currBeni[props.row.id].form.polygon" locked :zoom="17"/>
      </template>

    </v-server-table>

    <b-toast id="confirm-toastDelete" title="Richiesta conferma" solid no-auto-hide
      toaster="b-toaster-bottom-center" variant="secondary" v-model="waitUserConfirmationDelete">
      <div class="row justify-content-center">
        <div class="col-12">
          <p>Eliminare bene <b>approvato</b>?
          </p>
        </div>
        <div class="col-auto">
          <b-button variant="danger" @click="cancellaDef(rigaDaCancellare)">Conferma</b-button>
        </div>
      </div>
    </b-toast>
</div>
</template>

<script>
import IconMsg from '@/components/ui/IconMsg'
import ellipsize from '@/assets/js/Filters/ellipsizeLongText'
import BeneTableMixin from '@/components/mixins/BeneTable' // serve per vue-tables 2 non cancellare
import Map from '@/components/ui/Map'
import fetchBene from '@/assets/js/fetchBene'
import axios from 'axios'
import qs from 'qs'
window.axios = axios // serve per vueTables

// Mostra una tabella con tutti i beni approvati di tutti gli utenti
export default {
  name: 'RicercaBeniApprovati',
  mixins: [BeneTableMixin],
  components: { IconMsg, Map },
  filters: { ellipsizeLongText: ellipsize },
  props: {
    // etichetta associata alla tabella
    caption: { type: String, default: 'Questa tabella contiene tutti i beni approvati.' },
    // se è vero non si possono compiere azioni (visualizza/modifica) sugli elementi
    noActions: Boolean
  },
  computed: {
    sonoRevisore () {
      return this.$store.getters.getUserData.role === 'revisore'
    }
  },
  methods: {
    openModalEdit (idBene, idUtente) {
      this.idBene = idBene
      this.idUtente = idUtente
      this.modalShowEdit = true
    },
    openModalView (idBene, idUtente) {
      this.idBene = idBene
      this.idUtente = idUtente
      this.modalShowView = true
    },
    openChildRow (data) {
      const row = data.row
      fetchBene(this, {
        'id': row.id,
        'tmp_db': false
      }).then(resp => {
        this.$set(this.currBeni, row.id, resp)
      })
    },
    // cancella bene approvato
    cancellaDef (row) {
      axios.post(this.$store.getters.cancellaBeneDefURL,
        qs.stringify({
          username: this.$store.getters.getUserData.username,
          password: this.$store.getters.getUserData.password,
          id: row.id // id bene da cancellare
        })).then(resp => {
        // aggiorno la tabella se va tutto bene
        this.$refs.myTable.refresh()
        this.$vueEventBus.$emit('master-page-show-msg',
          ['Info', 'Bene eliminato correttamente'])
      })
      // nascondo il promp
        .finally(() => { this.waitUserConfirmationDelete = false })
    }
  },
  data: function () {
    return {
      // dettagli aggiuntivi dei beni scelti (vedi Vue tables 2 Child Row)
      currBeni: { },
      idBene: '',
      idUtente: '',
      // innesca la finestra di conferma eliminazione
      waitUserConfirmationDelete: false,
      // riga che l'utente vorrebbe cancellare
      rigaDaCancellare: {},
      columns: [
        'id',
        'azioni',
        'identificazione',
        'descrizione',
        'macroEpocaOrig',
        'macroEpocaCar',
        'toponimo',
        'comune',
        'esistenza',
        'bibliografia',
        'schedatori_iniziali',
        'note'
      ],
      options: {
        saveState: true,
        storage: 'session',
        caption: this.caption,
        filterByColumn: true,
        sendEmptyFilters: true
      }
    }
  },
  created () {
    // tolgo da vue tables le colonne status e msg_validatore che qua non sono usate
    this.options.filterable = this.options.filterable.filter(x => x !== 'status' &&
     x !== 'msg_validatore')
    if (this.noActions) {
      let newCols = this.columns.filter(el => el !== 'azioni')
      this.$set(this, 'columns', newCols)
    }
  },
  mounted () {
    this.updateFiltersCount('myTable')
  }
}
</script>

<style>
</style>
