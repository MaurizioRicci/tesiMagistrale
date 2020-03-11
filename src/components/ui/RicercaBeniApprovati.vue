<template>
<div>
  <v-server-table :columns="columns" :options="options" class="myTable table-sm"
    :url="$store.getters.beniAggiuntiApprovatiURL" name="ricercaBeniApprovati"
    @click="e => openChildRow(e)">

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
          </b-button-group>
        </template>

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
        <Map height="300px" v-if="currBeni[props.row.id]"
          :center="currBeni[props.row.id].mapCenter"
          :polygon="currBeni[props.row.id].form.polygon" locked :zoom="17"/>
      </template>

    </v-server-table>

  <b-modal title="Dettagli" size="huge"
  :cancel-disabled="true" v-model="modalShowView">
    <Dettagli-bene :idBene="idBene" no-menu/>
  </b-modal>
  <b-modal title="Modifica" size="huge"
    :cancel-disabled="true" v-model="modalShowEdit">
        <EditBene :idBene="idBene" no-menu :editMode="true"/>
  </b-modal>
</div>
</template>

<script>
import IconMsg from '@/components/ui/IconMsg'
import ellipsize from '@/assets/js/Filters/ellipsizeLongText'
import '@/assets/styles/hugeModal.css'
import BeneTableMixin from '@/components/mixins/BeneTable' // serve per vue-tables 2 non cancellare
import Map from '@/components/ui/Map'
import fetchBene from '@/assets/js/fetchBene'
window.axios = require('axios')

// Mostra una tabella con tutti i beni approvati di tutti gli utenti
export default {
  name: 'RicercaBeniApprovati',
  mixins: [BeneTableMixin],
  components: { IconMsg, Map },
  filters: { ellipsizeLongText: ellipsize },
  props: {
    caption: { type: String, default: 'Questa tabella contiene tutti i beni approvati.' },
    // se è vero non si possono compiere azioni (visualizza/modifica) sugli elementi
    noActions: Boolean
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
    }
  },
  data: function () {
    return {
      // dettagli aggiuntivi dei beni scelti (vedi Vue tables 2 Child Row)
      currBeni: { },
      idBene: '',
      idUtente: '',
      modalShowView: false,
      modalShowEdit: false,
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
  }
}
</script>

<style>
.VueTables__child-row-toggler {
    width: 16px;
    height: 16px;
    line-height: 16px;
    display: block;
    margin: auto;
    text-align: center;
}

.VueTables__child-row-toggler--closed::before {
    content: "+";
    color: blue;
    font-size: 1.1em;
}

.VueTables__child-row-toggler--open::before {
    content: "-";
    color: blue;
    font-size: 1.1em;
}
</style>
