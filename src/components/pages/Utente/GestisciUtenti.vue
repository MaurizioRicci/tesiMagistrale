<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
        <b-col>
          <h2 v-if="!noTitle">{{title || 'Gestione utenti'}}</h2>
        </b-col>
      </b-row>
      <b-row>
          <b-col cols="12">
              <b-button class="mb-1" @click="addUser">Aggiungi utente</b-button>
              <b-button variant="warning" class="mb-1" @click="convalida">Convalida</b-button>
          </b-col>
            <b-col cols="12" xl="6" class="text-left">
              <p>Premere aggiungi utente per un nuovo utente, poi cliccare sui campi da modificare.</p>
              <p>Per facilitare il lavoro eventuali utenti senza username e senza password saranno ignorati.</p>
              <p>ID minimo e ID massimo rappresentano l'intervallo di ID (estremi inclusi) usabile da
                 quel dato utente per fare acquisizione.</p>
              <p>Al termine del lavoro premere su convalida e attendere la risposta dal server.</p>
              <p class="bg-warning d-inline-block">Attenzione: devono essere rispettate delle regole:</p>
              <ul>
                  <li>Username e Password devono essere unici, non possono esistere due utenti con stesso username
                    e stessa password. Altrimenti non è possibile discriminare un utente da un altro.</li>
                  <li>Le iniziali vanno scritte tutte in maiuscolo.</li>
                  <li>Tutti i campi sono richiesti. In rosso quelli da riempire</li>
              </ul>
              <p>La violazione delle regole sopra citate comporterà necessariamente il fallimento dell'operazione di convalida.</p>
          </b-col>
          <b-col cols="12">
                <v-client-table :columns="columns" v-model="tableData" :options="options"
                    @update="updateRow">
                    <template v-for="colName in columns"
                        v-slot:[colName]="{row, update, setEditing, isEditing, revertValue}">
                        <div :key="colName"
                          :class="{'border rounded border-danger': colonnaVuota(row, colName, row[colName])
                            || userCollide(row, colName, row[colName])}">
                            <span @click="options.editableColumns.includes(colName) && setEditing(true)"
                                v-if="!options.editableColumns.includes(colName) || !isEditing()">
                                <!-- class="d-inline-block w-100" da spessore per la modifica della cella
                                anche se la cella ha come contenuto stringa vuota (utente appena aggiunto) -->
                                <a class="d-inline-block w-100">{{row[colName]}}</a>
                            </span>
                            <span v-else>
                                <input type="text" v-model="row[colName]" v-if="colName !== 'role'">
                                <b-form-select v-else v-model="row[colName]" :options="rolesOption"></b-form-select>
                                <b-button variant="primary"
                                    @click="update(row[colName]); setEditing(false)">Ok</b-button>
                                <b-button type="button"
                                    @click="revertValue(); setEditing(false)">Annulla</b-button>
                            </span>
                        </div>
                    </template>
                </v-client-table>
          </b-col>
      </b-row>
  </b-container>
</template>

<script>
import pageCommonMixin from '@/components/mixins/PageCommon'
import Menu from '@/components/ui/Menu'
const qs = require('qs')
const axios = require('axios')

export default {
  name: 'GestisciUtenti',
  components: {Menu},
  mixins: [pageCommonMixin],
  data () {
    return {
      tableData: [],
      columns: ['gid', 'username', 'password', 'role', 'iniziali',
        'nome', 'cognome', 'id_min', 'id_max'],
      options: {
        headings: {
          gid: 'ID utente',
          id_min: 'ID minimo',
          id_max: 'ID massimo',
          role: 'Ruolo'
        },
        uniqueKey: 'gid',
        editableColumns: ['username', 'password', 'role', 'iniziali',
          'nome', 'cognome', 'id_min', 'id_max'],
        filterable: true,
        filterByColumn: true
      },
      users: {
        ins: [],
        mod: []
      },
      rolesOption: [
        { value: 'schedatore', text: 'schedatore' },
        { value: 'revisore', text: 'revisore' }
      ]
    }
  },
  methods: {
    retriveUsers: function () {
      axios.post(this.$store.getters.gestioneUtentiURL, qs.stringify({
        username: this.$store.getters.getUserData.username,
        password: this.$store.getters.getUserData.password,
        usersList: true
      }))
        .then((resp) => { this.tableData = resp.data })
        .catch((error) => {
        // se è presente un messaggio di risposta dal server uso quello
        // altrimenti viene usato un messaggio di axios relativo al codice d'errore
          let msg = (error.response && error.response.data.msg) || error.message
          this.$vueEventBus.$emit('master-page-show-msg', ['Errore', msg])
        })
    },
    updateRow: function (row, column, oldVal, newVal) {
      let rowData = row.row
      // se l'utente modificato era stato aggiunto tolgo il vecchio valore e aggiorno
      if (this.users.ins.filter(el => el.gid === rowData.gid).length > 0) {
        // tolgo il vecchio valore con filter
        this.users.ins = this.users.ins.filter((el) => el.gid !== rowData.gid)
        // aggiorno
        this.users.ins.push(rowData)
      } else {
        // se lo stesso utente viene modificato più volte scarto le altre modifiche
        // tolgo il vecchio valore con filter
        this.users.mod = this.users.mod.filter((el) => el.gid !== rowData.gid)
        // aggiorno
        this.users.mod.push(rowData)
      }
    },
    insertRow: function (row, column, oldVal, newVal) {
      let rowData = row.row
      this.users.ins.push(rowData)
    },
    addUser: function () {
      let user = {
        'gid': String(this.nextGID() + 1),
        'username': '',
        'password': '',
        'role': '',
        'iniziali': '',
        'nome': '',
        'cognome': '',
        'id_min': '',
        'id_max': ''
      }
      this.tableData.push(user)
      this.users.ins.push(user)
      // scroll to the bottom of page
      window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight)
    },
    nextGID: function () {
      // la tabella vuole un id per ogni riga, sicchè devo calcolare un id sequenziale
      // trovo il massimo tra tutti gli id (gid) degli utenti
      // ATTENZIONE: è fragile questa cosa, si pensi al caso in cui un utente viene eliminato
      return Math.max.apply(Math, this.tableData.map((el) => Number(el.gid)))
    },
    convalida: function () {
      axios.post(this.$store.getters.gestioneUtentiURL, qs.stringify({
        username: this.$store.getters.getUserData.username,
        password: this.$store.getters.getUserData.password,
        ins: this.users.ins,
        mod: this.users.mod
      }))
        .then((resp) => {
          this.$vueEventBus.$emit('master-page-show-msg',
            ['Info', 'Operazione completata'])
          this.retriveUsers()
        })
        .catch((error) => {
        // se è presente un messaggio di risposta dal server uso quello
        // altrimenti viene usato un messaggio di axios relativo al codice d'errore
          let msg = (error.response && error.response.data.msg) || error.message
          this.$vueEventBus.$emit('master-page-show-msg', ['Errore', msg])
        })
    },
    // dice se la colonna corrente è vuota o no
    colonnaVuota: function (row, colName, valoreCella) {
      return !valoreCella
    },
    // dice se le credenziali di un utente collidono con quelle di un altro
    userCollide: function (row, colName, valoreCella) {
      return (colName === 'username' || colName === 'password') &&
        this.collidingUsers.includes(row.gid)
    }
  },
  computed: {
    // computa la lista di id di utenti i cui username e password collidono
    collidingUsers: function () {
      let copy = this.tableData.concat(this.users.ins).concat(this.users.mod)
      let colliding = []
      copy.forEach(el => {
        copy.forEach(el2 => {
          // console.log(el + ' ' + el2)
          if (el.gid !== el2.gid && el.username === el2.username &&
             el.password === el2.password) { colliding.push(el.gid) }
        })
      })
      return colliding
    }
  },
  mounted () {
    this.retriveUsers()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
