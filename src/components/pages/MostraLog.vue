<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12">
        <Menu/>
      </b-col>
      <b-col>
        <h2>Mostra log</h2>
        <p class="m-0">
            Ultimi
            <b-form-input type="number" v-model="maxLog"
            class="d-inline w-auto" size="sm"/>
             logs</p>
        <b-button class="m-1" @click="getData">Aggiorna</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <v-client-table :columns="columns" v-model="data"
        :options="options" class="table-sm">
        </v-client-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// Mostro i log per monitorare eventuali errori lato server
import Menu from '@/components/ui/Menu'
import axios from 'axios'

// Io sono solo un componente da cui copiare il template ogni volta.
export default {
  name: 'MostraLog',
  components: { Menu },
  data () {
    return {
      maxLog: 100,
      columns: ['date', 'title', 'txt'],
      data: [],
      options: {
        headings: {
          date: 'Locale date',
          txt: 'Message'
        },
        perPage: 100,
        perPageValues: [],
        filterable: true,
        filterByColumn: true
      }
    }
  },
  methods: {
    getData () {
      return axios.get(this.$store.getters.getLogURL, {
        params: {
          limit: this.maxLog
        }
      })
        .then(res => {
          this.data = res.data.map(row => {
            let date = new Date(row.date)
            row.date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
            return row
          })
        })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
