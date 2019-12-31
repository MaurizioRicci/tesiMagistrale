<template>
<div>
  <v-server-table :columns="columns" :options="options" class="myTable"
    :url="$store.getters.beniAggiuntiApprovatiURL">

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
import BeneTableMixin from '@/components/mixins/BeneTable'
window.axios = require('axios') // serve per vue-tables 2 non cancellare

// Mostra una tabella con tutti i beni approvati di tutti gli utenti
export default {
  name: 'BeniUtente',
  mixins: [BeneTableMixin],
  components: {IconMsg},
  filters: {ellipsizeLongText: ellipsize},
  props: {},
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
        'azioni',
        'identificazione',
        'descrizione',
        'comune',
        'macroEpocaCar',
        'macroEpocaOrig',
        'bibliografia',
        'note',
        'toponimo',
        'schedatori_iniziali'
      ],
      options: {
        caption: 'Questa tabella contiene tutti i beni approvati.',
        perPage: 25,
        filterByColumn: true,
        sendEmptyFilters: true,
        sortIcon: {
          base: 'fas',
          is: 'fa-sort',
          up: 'fa-sort-up',
          down: 'fa-sort-down'
        }
      }
    }
  },
  mounted () {}
}
</script>

<style scoped>
    .myTable >>> caption { caption-side: top; }
</style>
