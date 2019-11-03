<!-- BeniAggiuntiInRevisione, mostra i beni aggiunti dall'utente
oppure quelli che ha in revisione -->
<template>
<div>
    <vue-bootstrap-table
            class="m-2 table-sm"
            :columns="columns"
            :selectable="false"
            :show-filter="true"
            :show-column-picker="true"
            :sortable="true"
            :paginated="true"
            :multi-column-sortable="true"
            :filter-case-sensitive="false"
            :ajax="ajax"
            @cellDataModifiedEvent="onCellDataModifiedEvent">

        <template v-slot:status="{value}">
          <div :class="{'bg-warning': value.status === '0',
          'bg-danger': value.status === '1'}"
          class="mt-1">
          <span v-if="value.status === '0'">In revisione</span>
          <span v-if="value.status === '1'" class="text-light">Da rivedere</span>
          </div>
        </template>

        <template v-slot:azioni="{value}">
            <b-button @click="idBene = value.id"
             v-b-modal.modal-dettagli>Vedi dettagli</b-button>
            <b-button @click="idBene = value.id"
             v-b-modal.modal-modifica v-if="value.status === '1'">Modifica</b-button>
        </template>
    </vue-bootstrap-table>

  <b-modal id="modal-dettagli" title="Dettagli" size="huge"
  :cancel-disabled="true">
    <Dettagli-bene :id="idBene"
    :cercaInRevisione="true"/>
  </b-modal>
  <b-modal id="modal-modifica" title="Modifica" size="huge"
    :cancel-disabled="true">
        <EditBene :id="idBene"
          :cercaInRevisione="true"/>
  </b-modal>
</div>
</template>

<script>
import VueBootstrapTable from 'vue2-bootstrap-table2'
import DettagliBene from '@/components/pages/Bene/ViewBene'
import EditBene from '@/components/pages/Bene/AddEditBene'
import '@/assets/css/hugeModal.css'
const qs = require('qs')

export default {
  name: 'BeniAggiuntiInRevisione',
  components: {
    VueBootstrapTable: VueBootstrapTable,
    DettagliBene: DettagliBene,
    EditBene: EditBene
  },
  methods: {
    onCellDataModifiedEvent: function (originalValue, newValue, columnTitle, entry) {
      console.log('cellDataModifiedEvent - Original Value : ' + originalValue +
                                         ' | New Value : ' + newValue +
                                         ' | Column : ' + columnTitle +
                                         ' | Complete Entry : ' + entry)
    }
  },
  data: function () {
    return {
      idBene: '',
      columns: [
        {
          title: 'id'
        },
        {
          title: 'status'
        },
        {
          title: 'azioni'
        },
        {
          title: 'identificazione',
          visible: true,
          filterable: true
        },
        {
          title: 'descrizione',
          visible: true
        },
        {
          title: 'comune',
          visible: true,
          sortable: false
        },
        {
          title: 'macroEpocaCar',
          visible: true,
          sortable: false
        },
        {
          title: 'macroEpocaOrig',
          visible: true,
          sortable: false
        },
        {
          title: 'bibliografia',
          visible: true,
          sortable: false
        },
        {
          title: 'note',
          visible: true,
          sortable: false
        },
        {
          title: 'toponimo',
          visible: true,
          sortable: false
        },
        {
          name: 'msg_validatore',
          title: 'msg_validatore'
        }
      ],
      ajax: {
        enabled: true,
        url: this.$store.getters.beniAggiuntiRevisioneURL,
        method: 'POST',
        delegate: false,
        axiosConfig: {
          transformRequest: [
            (data, headers) => {
              let dataObj = qs.parse(data)
              dataObj.username = this.$store.getters.getUserData.username
              dataObj.password = this.$store.getters.getUserData.password
              return qs.stringify(dataObj)
            }
          ]
        }
        // this.$store.getters.getUserData.username,
        // this.$store.getters.getUserData.password
      }
    }
  }
}
</script>
