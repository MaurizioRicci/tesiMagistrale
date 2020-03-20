<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <h2 v-if="!noTitle">{{title || 'Home page'}}</h2>
      </b-col>
    </b-row>
    <b-row class="mt-3" align-h="center">
      <h5 class="col-12">
        Benvenuto
        <b-badge variant="info">{{$store.getters.getUserData.username}}</b-badge>
        La tua sigla è
        <b-badge variant="info">{{data.iniziali}}</b-badge>
      </h5>
      <!-- Breve descrizione + Collegamenti rapidi -->
      <b-col class="text-left mt-1" cols="12" md="10" lg="6">
        <p>
          Questa applicazione permette di acquisire dati per il sistema di Historical GIS. I dati sono formati da
          <b-badge>Beni</b-badge>
          (identificano un luogo sul territorio dove esiste o esisteva una entità geografica) e
          <b-badge>Funzioni</b-badge>
          (descrivono le relazione tra beni; es: il bene 1 paga un tributo al bene 2).
          La fase di acquisizione consiste nell'individuare Beni e Funzioni che legano insieme tali Beni. Prima di acquisire occorre andare sulle apposite pagine
          <b-breadcrumb>
            <b-breadcrumb-item active>Beni</b-breadcrumb-item>
            <b-breadcrumb-item to="/bene/ricerca">Ricerca Beni</b-breadcrumb-item>
          </b-breadcrumb>
          e
          <b-breadcrumb>
            <b-breadcrumb-item active>Funzioni</b-breadcrumb-item>
            <b-breadcrumb-item to="/funzione/ricerca">Ricerca Funzioni</b-breadcrumb-item>
          </b-breadcrumb>
          per verificare che il lavoro non sia già stato fatto da altri.
        </p>
        <p>
          La barra principale in alto, il
          <b-badge>Menu</b-badge>
          ha le seguenti aree sensibili:
        <ul>
          <li>Home: va alla home del progetto</li>
          <li>Beni: apre un menu per analizzare i Beni presenti in archivio, per modificarli o aggiungerne altri</li>
          <li>Funzioni: apre un menu per analizzare le Funzioni presenti in archivio, per modificarle o aggiungerne altre</li>
          <li>Il lavoro: apre un menu per analizzare il lavoro inerente beni o funzioni.</li>
        </ul>
        </p>
        <b-row align-h="center" no-gutters style="margin-top: -1rem">
          <!-- Collegamenti rapidi -->
          <b-col class="text-left mt-0" cols="auto">
            <b-card header="Collegamenti rapidi" no-body bg-variant="info" text-variant="white">
              <b-list-group flush>
                <b-list-group-item>
                  <b-link to="/bene/aggiungi">
                    Aggiungi un bene
                  </b-link>
                </b-list-group-item>
                <b-list-group-item>
                  <b-link to="/bene/ricerca">
                    Ricerca un bene
                  </b-link>
                </b-list-group-item>
                <b-list-group-item>
                  <b-link to="/funzione/aggiungi">
                    Aggiungi una funzione tra due beni
                  </b-link>
                </b-list-group-item>
                <b-list-group-item>
                  <b-link to="/aiuto">Aiuto</b-link>
                </b-list-group-item>
                <b-list-group-item>
                  <b-link @click="logout">Logout</b-link>
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
      <!-- Statistiche -->
      <b-col class="text-left mt-1" cols="auto">
        <b-card header="Info e statistiche" no-footer>
          <p>
            Il tuo ruolo è
            <b-badge variant="info">{{$store.getters.getUserData.role}}</b-badge>
          </p>
          <p>
            Gli ID a te riservati variano da
            <b-badge variant="info">{{data.id_min}}</b-badge>
            a
            <b-badge variant="info">{{data.id_max}}</b-badge>
          </p>
          <p>
            Il tuo ultimo ID usato per un Bene è
            <b-badge variant="info">{{data.ultimo_id_bene}}</b-badge>
          </p>
          <hr/>
          <div v-if="isRevisore" key="revisorePage">
            <p>
              Hai
              <b-badge variant="info">{{data.n_beni_da_revisionare}}</b-badge>
              <!-- Questo è amore per l'utente, se è 1 scrivo Bene, altrimenti Beni -->
              {{data.n_beni_da_revisionare | formatBeni}}
              da revisionare.
            </p>
            <p>
              Hai
              <b-badge variant="info">{{data.n_funzioni_da_revisionare}}</b-badge>
              {{data.n_funzioni_da_revisionare | formatFunzioni}}
              da revisionare.
            </p>
          </div>
          <div v-else key="schedatorePage">
            <p>
              Hai
              <b-badge variant="info">{{data.n_beni_pronti}}</b-badge>
              {{data.n_beni_pronti | formatBeni}}
              in attesa di invio.
            </p>
            <p>
              Hai
              <b-badge variant="info">{{data.n_funzioni_pronte}}</b-badge>
              {{data.n_funzioni_pronte | formatFunzioni}}
              in attesa di invio.
            </p>
            <p>
              Hai
              <b-badge variant="info">{{data.n_beni_rev}}</b-badge>
              {{data.n_beni_rev | formatBeni}}
              in attesa di revisione.
            </p>
            <p>
              Hai
              <b-badge variant="info">{{data.n_funzioni_rev}}</b-badge>
              {{data.n_funzioni_rev | formatFunzioni}}
              in attesa di revisione.
            </p>
            <p>
              Hai
              <b-badge variant="info">{{data.n_beni_da_correggere}}</b-badge>
              {{data.n_beni_da_correggere | formatBeni}}
              da correggere.
            </p>
            <p>
              Hai
              <b-badge variant="info">{{data.n_funzioni_da_correggere}}</b-badge>
              {{data.n_funzioni_da_correggere | formatFunzioni}}
              da correggere.
            </p>
            <p>
              Hai
              <b-badge variant="info">{{data.n_beni_incompleti}}</b-badge>
              {{data.n_beni_incompleti | formatBeni}}
              incompleti.
            </p>
            <p>
              Hai
              <b-badge variant="info">{{data.n_funzioni_incomplete}}</b-badge>
              {{data.n_funzioni_incomplete | formatFunzioni}}
              incomplete.
            </p>
          </div>
        </b-card>
      </b-col>
      <!-- Utenti & logout -->
      <b-col cols="12">
        <hr class="w-50"/>
        <b-button to="/gestisci_utenti" variant="warning"
          v-if="isRevisore">Aggiungi / Modifica utenti</b-button>
        <b-button @click="logout">Logout</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import Menu from '@/components/ui/Menu'
import axios from 'axios'
import qs from 'qs'

// @group Pages
export default {
  name: 'Home',
  components: { Menu },
  mixins: [commonPageMixin],
  data () {
    return {
      data: {}
    }
  },
  filters: {
    // scrivo Bene/Beni o Funzione/Funzioni a seconda del numero
    formatBeni: (numBeni) => Number(numBeni) === 1 ? 'Bene' : 'Beni',
    formatFunzioni: (numFunzioni) => Number(numFunzioni) === 1 ? 'Funzione' : 'Funzioni'
  },
  computed: {
    isRevisore: function () {
      return this.$store.getters.getUserData.role === 'revisore'
    }
  },
  methods: {
    getData () {
      axios.post(this.$store.getters.userStatsURL,
        qs.stringify({
          username: this.$store.getters.getUserData.username,
          password: this.$store.getters.getUserData.password
        })).then(function (resp) {
        this.$set(this, 'data', resp.data)
      }.bind(this))
    },
    logout () {
      // dico a Vuex di cancellare i dati utente
      this.$store.commit('logoutUser')
      // mando l'utente alla pagina di login
      this.$router.push('/')
    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    $route (to, from) {
      // react to route changes...
      this.getData()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p:last-of-type {
  margin-bottom: 0px;
}
.badge {
  font-size: 100%;
}
.card-header {
  font-weight: bold;
  padding: 7px;
}
.breadcrumb, .breadcrumb-item {
  display: inline-block;
  margin: 0px;
  padding: 2px;
}
.breadcrumb-item:first-child::before {
  content: ''
}
.breadcrumb-item::before {
  content: '→'
}
</style>
