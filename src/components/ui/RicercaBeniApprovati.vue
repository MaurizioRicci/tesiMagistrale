<!-- Da fare! Ho fatto copia incolla da BeniUtente -->
<template>
<div>
  <v-client-table :columns="columns" v-model="tableData" :options="options">

        <template v-slot:status="{row}">
          <div :class="{'bg-warning': row.status === '0',
          'bg-danger': row.status === '1'}"
          class="mt-1">
          <span v-if="row.status === '0'">In revisione</span>
          <span v-if="row.status === '1'" class="text-light">Da rivedere</span>
          </div>
        </template>

        <template v-slot:azioni="{row}">
          <b-button-group vertical>
            <b-button @click="() => openModalView(row.id)" class="pt-1">Vedi dettagli</b-button>
            <b-button @click="() => openModalEdit(row.id)" class="pt-1"
             v-if="!cercaInRevisione || row.status === '1'">Modifica</b-button>
          </b-button-group>
        </template>
    </v-client-table>

  <b-modal title="Dettagli" size="huge"
  :cancel-disabled="true" v-model="modalShowView">
    <Dettagli-bene :id="idBene"
    :cercaInRevisione="cercaInRevisione"/>
  </b-modal>
  <b-modal title="Modifica" size="huge"
    :cancel-disabled="true" v-model="modalShowEdit">
        <EditBene :id="idBene"
          :cercaInRevisione="cercaInRevisione"/>
  </b-modal>
</div>
</template>

<script>
import DettagliBene from '@/components/pages/Bene/ViewBene'
import EditBene from '@/components/pages/Bene/AddEditBene'
import '@/assets/css/hugeModal.css'
const qs = require('qs')
const axios = require('axios')

export default {
  name: 'BeniApprovatiTutti',
  components: {
    DettagliBene: DettagliBene,
    EditBene: EditBene
  },
  props: {cercaInRevisione: Boolean},
  methods: {
    openModalEdit: function (id) {
      this.idBene = id
      this.modalShowEdit = true
    },
    openModalView: function (id) {
      this.idBene = id
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
