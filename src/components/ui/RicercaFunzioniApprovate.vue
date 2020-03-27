<template>
<div>
  <v-server-table :columns="columns" :options="options" class="myTable table-sm" ref="myTable"
    :url="$store.getters.funzioniAggiunteApprovateURL" name="ricercaFunzioniApprovate">

        <template v-slot:azioni="{row}">
          <b-button-group horizontal>
            <b-button :to="'/funzione/dettagli_funzione/'.concat(row.id)" class="pt-1"
              variant="light">
              <icon-msg icon_name="info-circle" icon_msg="Vedi dettagli"/>
            </b-button>
            <b-button :to="'/funzione/modifica/'.concat(row.id)" row.id class="pt-1"
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

      <template v-slot:ruolo="{row}">
        <!-- e' un array di ruoli, li separo con virgola -->
        {{JSON.parse(row.ruolo).join(',')}}
      </template>

        <template v-slot:ruolor="{row}">
        <!-- e' un array di ruoli, li separo con virgola -->
        {{JSON.parse(row.ruolor).join(',')}}
      </template>

      <template v-slot:bibliografia="{row}">
        <!-- oltre i 50 caratteri (valore di default) tronco la stringa con i puntini -->
        <span :title="row.bibliografia">{{row.bibliografia | ellipsizeLongText()}}</span>
      </template>

      <template v-slot:note="{row}">
        <!-- oltre i 50 caratteri (valore di default) tronco la stringa con i puntini -->
        <span :title="row.note">{{row.note | ellipsizeLongText()}}</span>
      </template>
    </v-server-table>

    <b-toast id="confirm-toastDelete" title="Richiesta conferma" solid no-auto-hide
      toaster="b-toaster-bottom-center" variant="secondary" v-model="waitUserConfirmationDelete">
      <div class="row justify-content-center">
        <div class="col-12">
          <p>Eliminare funzione <b>approvata</b>?
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
import FunzioneTableMixin from '@/components/mixins/FunzioneTable'
import axios from 'axios'
import qs from 'qs'
window.axios = axios // serve per vueTables

// Mostra una tabella con tutti i beni approvati di tutti gli utenti
export default {
  name: 'RicercaFunzioniApprovate',
  components: { IconMsg },
  mixins: [FunzioneTableMixin],
  filters: { ellipsizeLongText: ellipsize },
  props: {
    // etichetta associata alla tabella
    caption: { type: String, default: 'Questa tabella contiene tutte le funzioni approvate.' },
    // se è vero non si possono compiere azioni (visualizza/modifica) sugli elementi
    noActions: Boolean
  },
  computed: {
    sonoRevisore () {
      return this.$store.getters.getUserData.role === 'revisore'
    }
  },
  methods: {
    // cancella funzione approvata
    cancellaDef (row) {
      axios.post(this.$store.getters.cancellaFunzioneDefURL,
        qs.stringify({
          username: this.$store.getters.getUserData.username,
          password: this.$store.getters.getUserData.password,
          id: row.id // id funzione
        })).then(resp => {
        // aggiorno la tabella se va tutto bene
        this.$refs.myTable.refresh()
        this.$vueEventBus.$emit('master-page-show-msg',
          ['Info', 'Funzione eliminata correttamente'])
      })
      // nascondo il promp
        .finally(() => { this.waitUserConfirmationDelete = false })
    }
  },
  data: function () {
    return {
      // innesca la finestra di conferma eliminazione
      waitUserConfirmationDelete: false,
      // riga che l'utente vorrebbe cancellare
      rigaDaCancellare: {},
      columns: [
        'azioni',
        'data_ante',
        'data_post',
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
        'schedatori_iniziali'
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
  }
}
</script>
