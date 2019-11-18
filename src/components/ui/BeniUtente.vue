<!-- Beni Aggiunti o In Revisione, mostra i beni aggiunti dall'utente
oppure quelli che ha in revisione -->
<template>
<div>
  <v-client-table :columns="columns" v-model="tableData" :options="options">

        <template v-slot:status="{row}">
          <div :class="{'bg-warning': row.status === '0',
          'bg-danger': row.status === '1'}"
          class="mt-1">
          <span v-if="BeneModel.isRev.call(row)">In revisione</span>
          <span v-if="BeneModel.isIncomplete.call(row)" class="text-light">Da rivedere</span>
          </div>
        </template>

        <template v-slot:azioni="{row}">
          <b-button-group vertical>
            <b-button @click="() => openModalView(row.id, row.id_utente)" class="pt-1">Vedi dettagli</b-button>
            <b-button @click="() => openModalEdit(row.id, row.id_utente)" class="pt-1"
             v-if="!cercaInRevisione || BeneModel.isIncomplete.call(row)">Modifica</b-button>
          </b-button-group>
        </template>
    </v-client-table>

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
const qs = require('qs')
const axios = require('axios')

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
    },
    getData: function () {
      return axios.post(this.$store.getters.beniAggiuntiRevisioneURL,
        qs.stringify({
          username: this.$store.getters.getUserData.username,
          password: this.$store.getters.getUserData.password,
          switch_bene: this.cercaInRevisione ? 'miei_revisione' : 'miei_aggiunti'
        })).then(function (resp) { this.tableData = resp.data }.bind(this))
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
        // visible: this.cercaInRevisione
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
        filterByColumn: true
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
