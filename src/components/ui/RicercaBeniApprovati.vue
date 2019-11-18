<template>
<div>
  <v-server-table :columns="columns" :options="options" class="myTable"
    :url="$store.getters.beniAggiuntiApprovatiURL">

        <template v-slot:azioni="{row}">
          <b-button-group vertical>
            <b-button @click="() => openModalView(row.id, row.id_utente)" class="pt-1">Vedi dettagli</b-button>
            <b-button @click="() => openModalEdit(row.id, row.id_utente)" class="pt-1"
             v-if="!cercaInRevisione || BeneModel.isIncomplete.call(row)">Modifica</b-button>
          </b-button-group>
        </template>

    </v-server-table>

  <b-modal title="Dettagli" size="huge"
  :cancel-disabled="true" v-model="modalShowView">
    <Dettagli-bene :idBene="idBene"
    :cercaInRevisione="cercaInRevisione"
    :idUtente="idUtente"/>
  </b-modal>
  <b-modal title="Modifica" size="huge"
    :cancel-disabled="true" v-model="modalShowEdit">
        <EditBene :idBene="idBene"
          :cercaInRevisione="cercaInRevisione"/>
  </b-modal>
</div>
</template>

<script>
import DettagliBene from '@/components/pages/Bene/ViewBene'
import EditBene from '@/components/pages/Bene/AddEditBene'
import BeneModel from '@/assets/js/Models/beneModel'
import '@/assets/css/hugeModal.css'
window.axios = require('axios')

export default {
  name: 'BeniUtente',
  components: {
    DettagliBene: DettagliBene,
    EditBene: EditBene
  },
  computed: {BeneModel: () => BeneModel()},
  props: {cercaInRevisione: Boolean},
  methods: {
    openModalEdit: function (idBene, idUtente) {
      this.idBene = idBene
      this.idUtente = idUtente
      this.modalShowEdit = true
    },
    openModalView: function (idBene, idUtente) {
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
        filterable: true,
        filterByColumn: true,
        sendEmptyFilters: true,
        texts: {limit: 'Risultati per pagina'}
      }
    }
  }
}
</script>

<style>
    .VueTables__table { table-layout: fixed; }
</style>
