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
              <!-- 25/02/2020 sembra andare su IE, Firefox ma stranamento non su Chrome -->
              <b-button class="mb-1" @click="downloadUsersFile">Scarica schedatori</b-button>
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
                  <li>Le iniziali vanno scritte tutte in maiuscolo e devono essere uniche.</li>
                  <li>Tutti i campi sono richiesti. In rosso quelli da riempire</li>
              </ul>
              <p>La violazione delle regole sopra citate comporterà necessariamente il fallimento dell'operazione di convalida.</p>
          </b-col>
          <b-col cols="12">
                <v-client-table :columns="columns" v-model="tableData" :options="options"
                    @update="updateRow" ref="myTable" class="table-sm">
                    <template v-for="colName in columns"
                        v-slot:[colName]="{row, update, setEditing, isEditing, revertValue}">
                        <div :key="colName" style="cursor:pointer;"
                          :class="{'border rounded border-danger': hasErrors(row, colName, row[colName])}">
                            <!-- Se non è una colonna editabile o se non sono in editing
                            mostro il valore della cella semplice-->
                            <span :id="colName + row.uid"
                              @click="setEditing(true)"
                              v-if="!options.editableColumns.includes(colName) || !isEditing()">
                                <!-- class="d-inline-block w-100" da spessore per la modifica della cella
                                anche se la cella ha come contenuto stringa vuota (utente appena aggiunto) -->
                                <a class="d-inline-block"
                                  :class="{'w-100': row[colName] === ''}">{{row[colName]}}</a>
                            </span>
                            <!-- Se sto editando in base al nome della colonna cambio tra select, input text/number/email -->
                            <span :id="colName + row.uid" v-else>
                                <!-- number -->
                                <b-form-input type="number" v-model="row[colName]" :formatter="v => Math.max(-1, v)"
                                  v-if="colName === 'id_min' || colName === 'id_max'" key="numberInput"
                                  min="-1" number/>
                                <!-- email -->
                                  <b-form-input type="email" v-model="row[colName]"
                                  v-else-if="colName === 'email'" key="emailInput"/>
                                <!-- select -->
                                <b-form-input type="text" v-model="row[colName]" key="textInput"
                                  v-else-if="colName !== 'role'" :formatter="e => formatter(e, colName)"/>
                                <b-form-select v-else v-model="row[colName]" :options="rolesOption" key="selectInput"/>

                                <b-button variant="primary"
                                  @click="update(row[colName]); setEditing(false)">Ok</b-button>
                                <b-button type="button"
                                  @click="revertValue(); setEditing(false)">Annulla</b-button>
                            </span>
                            <!-- Segue la definizione di vari tooltip per specifici errori -->
                            <b-tooltip :target="colName + row.uid" triggers="hover"
                              v-if="colonnaVuota(row, colName, row[colName])">
                                Compila il campo
                            </b-tooltip>
                            <b-tooltip :target="colName + row.uid" triggers="hover"
                              v-if="!isValidEmail(row, colName, row[colName])">
                                Email invalida
                            </b-tooltip>
                            <b-tooltip :target="colName + row.uid" triggers="hover"
                              v-if="checkIniziali(row, colName, row[colName])">
                                Le iniziali devono essere maiuscole/non duplicate
                            </b-tooltip>
                            <b-tooltip :target="colName + row.uid" triggers="hover"
                              v-if="userCollide(row, colName, row[colName])">
                                Stesso username/password di un altro utente
                            </b-tooltip>
                            <b-tooltip :target="colName + row.uid" triggers="hover"
                              v-if="idsCollide(row, colName, row[colName])">
                                ID assegnato collide con quello di un'altro utente
                            </b-tooltip>
                        </div>
                    </template>
                </v-client-table>
          </b-col>
      </b-row>
  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import Menu from '@/components/ui/Menu'
import qs from 'qs'
import axios from 'axios'
import FileSaver from 'file-saver'
import sortByID from '@/assets/js/sortNumberAsString'
const _mapValues = require('lodash.mapvalues') // è come Array.map() solo con i dizionari
const _values = require('lodash.values') // rende una array contenenti tutti i valori in un dizionario
// regex presa da https://stackoverflow.com/questions/9572254/validate-email-with-regex-jquery
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i
// usato per sortare le colonne di id che sono numerici

// @group Pages
// Consente di aggiungere o modificare gli utenti, lascia la possibilità di assegnare tutti i dati.
export default {
  name: 'GestisciUtenti',
  components: { Menu },
  mixins: [commonPageMixin],
  data () {
    return {
      errors: {
        unique: false,
        iniziali: false,
        empty: false,
        overlappingIDs: false
      },
      tableData: [],
      columns: ['uid', 'username', 'password', 'email', 'role', 'iniziali',
        'nome', 'cognome', 'id_min', 'id_max'],
      options: {
        perPage: 30,
        perPageValues: [],
        headings: {
          uid: 'ID utente',
          id_min: 'ID minimo',
          id_max: 'ID massimo',
          role: 'Ruolo'
        },
        uniqueKey: 'uid',
        editableColumns: ['username', 'password', 'email', 'role', 'iniziali',
          'nome', 'cognome', 'id_min', 'id_max'],
        filterable: true,
        filterByColumn: true,
        customSorting: {
          id_min: sortByID('id_min'),
          id_max: sortByID('id_max')
        }
      },
      users: {
        ins: [],
        mod: []
      },
      rolesOption: [
        { value: '', text: 'Scegli ruolo' },
        { value: 'schedatore', text: 'schedatore' },
        { value: 'revisore', text: 'revisore' }
      ]
    }
  },
  methods: {
    hasErrors: function (row, colName) {
      return this.colonnaVuota(row, colName, row[colName]) ||
              this.userCollide(row, colName, row[colName]) ||
                this.checkIniziali(row, colName, row[colName]) ||
                  this.idsCollide(row, colName, row[colName]) ||
                  !this.isValidEmail(row, colName, row[colName]) ||
                  Number(row.id_min) > Number(row.id_max)
    },
    retriveUsers: function () {
      axios.post(this.$store.getters.gestioneUtentiURL, qs.stringify({
        username: this.$store.getters.getUserData.username,
        password: this.$store.getters.getUserData.password,
        usersList: true
      }))
        .then((resp) => { this.tableData = resp.data })
    },
    updateRow: function (row, column, oldVal, newVal) {
      let rowData = row.row
      // se l'utente modificato era stato aggiunto tolgo il vecchio valore e aggiorno
      if (this.users.ins.filter(el => el.uid === rowData.uid).length > 0) {
        // tolgo il vecchio valore con filter
        this.users.ins = this.users.ins.filter((el) => el.uid !== rowData.uid)
        // aggiorno
        this.users.ins.push(rowData)
      } else {
        // se lo stesso utente viene modificato più volte scarto le altre modifiche
        // tolgo il vecchio valore con filter
        this.users.mod = this.users.mod.filter((el) => el.uid !== rowData.uid)
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
        'uid': String(this.nextGID() + 1),
        'username': '',
        'password': '',
        'role': '',
        'iniziali': '',
        'nome': '',
        'cognome': '',
        'id_min': '-1',
        'id_max': '-1',
        'email': ''
      }
      this.tableData.push(user)
      this.users.ins.push(user)
      // scroll to the bottom of page
      window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight)
    },
    nextGID: function () {
      // la tabella vuole un id per ogni riga, sicchè devo calcolare un id sequenziale
      // trovo il massimo tra tutti gli id (uid) degli utenti
      // Si noti che si considera l'id massimo tra tutti gli utenti, anche tra quelli da aggiungere
      // questo meccanismo non dovrebbe mai dare errore
      return Math.max.apply(Math, this.wholeUsers.map((el) => Number(el.uid)))
    },
    // elimina le righe di utenti inserite lasciate vuote
    discardEmptyRows: function () {
      this.users.ins = this.users.ins.filter(el => {
      // per ogni oggetto user ne mappo i valori in un array (scartando il campo uid)
      // concateno tutti i valori dell'array in una stringa con join e poi guardo se non è vuota
        let keep = _values(_mapValues(el, (subEl, key) => key === 'uid' ? '' : subEl))
          .join('').trim() !== ''
        if (!keep) {
          this.tableData = this.tableData.filter(el2 => el2.uid !== el.uid)
        }
        return keep
      }
      )
    },
    convalida: function () {
      this.discardEmptyRows()
      // attendo l'aggiornamento delle righe nel dom prima di proseguire
      this.$nextTick().then(() => {
      // controllo se i dati sono errati prima di mandare
        if (this.erroriRilevati()) {
          this.$vueEventBus.$emit('master-page-show-msg',
            ['Errore',
              'Dati inseriti non corretti. I dati non corretti sono quelli in rosso, correggere grazie.'])
          return
        }
        // invio dati al server con richiesta POST
        axios.post(this.$store.getters.gestioneUtentiURL, qs.stringify({
          username: this.$store.getters.getUserData.username,
          password: this.$store.getters.getUserData.password,
          ins: this.users.ins,
          mod: this.users.mod
        }))
          .then(resp => {
            // resetto variabili di utenti inseriti/modificati se tutto va bene
            // se va male in main.js c'è un axios interceptors globale che mostra il responso
            // come messaggio di avviso nel caso in cui una richiesta di tipo POST fallisca
            this.users.ins = []
            this.users.mod = []
            this.$vueEventBus.$emit('master-page-show-msg',
              ['Info', 'Operazione completata'])
            this.retriveUsers()
          })
      })
    },
    // dice se la colonna corrente è vuota o no
    colonnaVuota: function (row, colName, valoreCella) {
      // il campo email non è segnato come da riempire è facoltativo
      if (colName === 'email') return false
      let res = !valoreCella
      this.errors.empty = this.errors.empty || res
      return res
    },
    // dice se le credenziali di un utente collidono con quelle di un altro
    userCollide: function (row, colName, valoreCella) {
      let res = (colName === 'username' || colName === 'password') &&
        this.collidingUsers.includes(row.uid)
      this.errors.unique = this.errors.unique || res
      return res
    },
    // dice se le iniziali non sono scritte in maiuscolo
    checkIniziali: function (row, colName, valoreCella) {
      let res = (colName === 'iniziali' && valoreCella !== valoreCella.toUpperCase()) ||
        (colName === 'iniziali' && this.overlappingInizali.includes(row.uid))
      this.errors.iniziali = this.errors.iniziali || res
      return res
    },
    erroriRilevati: function () {
      // un piccolo hack veloce per dire se sono presenti degli errori
      // se ci sono nella tabella qualche campo avra un bordo rosso
      // niente paura se fallisce ci pensa il db a controllare
      return this.$refs.myTable.$el
        .querySelector('.border-danger')
    },
    // dice se l'ID di un certo utente ha un range di id che collide con il range di altri utenti
    idsCollide: function (row, colName, valoreCella) {
      let res = (colName === 'id_min' || colName === 'id_max') &&
        this.overlappingIDS.includes(row.uid)
      this.errors.overlappingIDs = this.errors.overlappingIDs || res
      return res
    },
    // formatta le iniziali in maiuscolo
    formatter: function (val, colName) {
      return colName === 'iniziali' ? val.toUpperCase() : val
    },
    isValidEmail (row, colName, valoreCella) {
      // se la colonna è email fai il test, vero altrimenti
      return colName === 'email' && valoreCella !== '' ? emailRegex.test(valoreCella) : true
    },
    downloadUsersFile () {
      const data = this.tableData
      var txt = data.filter(el => el.role === 'schedatore') // solo schedatori
        // per ogni utente, ne prendo i valori e li rendo una stringa
        .map(el => JSON.stringify(el))
        .join('\n') // metto gli a capo, viene una stringa <utente1> \n <utente2> \n ... <utenteN>
      var blob = new Blob([txt], { type: 'application/json;charset=utf-8' })
      FileSaver.saveAs(blob, 'usersList.txt')
    }
  },
  computed: {
    wholeUsers: function () {
      return this.tableData.concat(this.users.ins).concat(this.users.mod)
    },
    // computa la lista di id di utenti i cui username e password collidono
    collidingUsers: function () {
      let copy = this.wholeUsers
      // lista di utenti da aggiungere/modificare
      let addEdit = this.users.ins.concat(this.users.mod)
      let colliding = []
      addEdit.forEach(el => {
        copy.forEach(el2 => {
          if (el.uid !== el2.uid && el.username === el2.username &&
             el.password === el2.password) {
            colliding.push(el.uid)
            colliding.push(el2.uid)
          }
        })
      })
      return colliding
    },
    // computa la lista di id di utenti i cui id min/max si sovrappongono
    overlappingIDS: function () {
      let copy = this.wholeUsers
      // lista di utenti da aggiungere/modificare
      let addEdit = this.users.ins.concat(this.users.mod)
      let overlapping = []
      let overlapID = (id, idMinRef, idMaxRef) =>
        Number(id) !== -1 && Number(id) >= Number(idMinRef) &&
             Number(id) <= Number(idMaxRef)
      addEdit.forEach(el => {
        copy.forEach(el2 => {
          // id utente diversi e almeno uno dei due id deve sovrapporsi
          if (el.uid !== el2.uid &&
          (// id min compreso nel range di un altro utente
            overlapID(el.id_min, el2.id_min, el2.id_max) ||
            // oppure id max compreso nel range di un altro utente
            overlapID(el.id_max, el2.id_min, el2.id_max) ||
            // oppure il range dell'utente comprende direttamente il range di altri utenti
            (Number(el.id_min) !== -1 && el.id_min <= el2.id_min && el.id_max >= el2.id_max)
          )) {
            overlapping.push(el.uid)
            overlapping.push(el2.uid)
          }
        })
      })
      return overlapping
    },
    // computa la lista di id di utenti con stesse iniziali
    overlappingInizali: function () {
      let copy = this.wholeUsers
      // lista di utenti da aggiungere/modificare
      let addEdit = this.users.ins.concat(this.users.mod)
      let overlapping = []
      addEdit.forEach(el => {
        copy.forEach(el2 => {
          // id utente diversi e almeno uno dei due id deve sovrapporsi
          if (el.uid !== el2.uid && el.iniziali === el2.iniziali) {
            overlapping.push(el.uid)
            overlapping.push(el2.uid)
          }
        })
      })
      return overlapping
    }
  },
  mounted () {
    this.retriveUsers()
  },
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    let resp = true
    if (this.users.ins.length > 0 || this.users.mod.length > 0) {
      resp = window.confirm('Hai modifiche in sospeso, abbandonare la pagina?')
    }
    if (resp) next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* >>> td {
  outline: none;
}
</style>
