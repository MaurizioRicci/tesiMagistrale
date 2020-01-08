<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
        <b-col>
          <h2 v-if="!noTitle">{{title || 'Home page'}}</h2>
        </b-col>
      </b-row>
      <b-row class="mt-3" align-h="center">
          <b-col class="text-left" cols="12" md="6" lg="3">
            <h5>Benvenuto
              <b-badge variant="info">{{$store.getters.getUserData.username}}</b-badge>
            </h5>
            <h5>Info e statistiche</h5>
            <p>Il tuo ruolo è
              <b-badge variant="info">{{$store.getters.getUserData.role}}</b-badge>
            </p>
            <p>Gli ID a te riservati variano da
              <b-badge variant="info">{{data.id_min}}</b-badge>
              a
              <b-badge variant="info">{{data.id_max}}</b-badge>
            </p>
            <p>Il tuo ultimo ID usato per un Bene è
              <b-badge variant="info">{{data.ultimo_id_bene}}</b-badge>
            </p>
            <p v-if="IDInEsaurimento" class="bg-warning d-inline-block rounded">
              ATTENZIONE: Stai per esaurire gli ID.
            </p>
            <hr/>
            <div v-if="data.role === 'revisore'" key="revisorePage">
              <p>Hai
                <b-badge variant="info">{{data.n_beni_da_revisionare}}</b-badge>
                <!-- Questo è amore per l'utente, se è 1 scrivo Bene, altrimenti Beni -->
                {{data.n_beni_da_revisionare | formatBeni}}
                da revisionare.</p>
              <p>Hai
                <b-badge variant="info">{{data.n_funzioni_da_revisionare}}</b-badge>
                <!-- Questo è amore per l'utente, se è 1 scrivo Funzione, altrimenti Funzioni -->
                {{data.n_funzioni_da_revisionare | formatFunzioni}}
                da revisionare.</p>
            </div>
            <div v-else key="schedatorePage">
              <p>Hai
                <b-badge variant="info">{{data.n_beni_pronti}}</b-badge>
                <!-- Questo è amore per l'utente, se è 1 scrivo Bene, altrimenti Beni -->
                {{data.n_beni_pronti | formatBeni}}
                in attesa di invio.</p>
              <p>Hai
                <b-badge variant="info">{{data.n_funzioni_pronte}}</b-badge>
                <!-- Questo è amore per l'utente, se è 1 scrivo Funzione, altrimenti Funzioni -->
                {{data.n_funzioni_pronte | formatFunzioni}}
                in attesa di invio.</p>
              <p>Hai
                <b-badge variant="info">{{data.n_beni_rev}}</b-badge>
                <!-- Questo è amore per l'utente, se è 1 scrivo Bene, altrimenti Beni -->
                {{data.n_beni_rev | formatBeni}}
                in attesa di revisione.</p>
              <p>Hai
                <b-badge variant="info">{{data.n_funzioni_rev}}</b-badge>
                <!-- Questo è amore per l'utente, se è 1 scrivo Funzione, altrimenti Funzioni -->
                {{data.n_funzioni_rev | formatFunzioni}}
                in attesa di revisione.</p>
              <p>Hai
                <b-badge variant="info">{{data.n_beni_da_correggere}}</b-badge>
                <!-- Questo è amore per l'utente, se è 1 scrivo Bene, altrimenti Beni -->
                {{data.n_beni_da_correggere | formatBeni}}
                da correggere.</p>
              <p>Hai
                <b-badge variant="info">{{data.n_funzioni_da_correggere}}</b-badge>
                <!-- Questo è amore per l'utente, se è 1 scrivo Funzione, altrimenti Funzioni -->
                {{data.n_funzioni_da_correggere | formatFunzioni}}
                da correggere.</p>
              <p>Hai
                <b-badge variant="info">{{data.n_beni_incompleti}}</b-badge>
                <!-- Questo è amore per l'utente, se è 1 scrivo Bene, altrimenti Beni -->
                {{data.n_beni_incompleti | formatBeni}}
                incompleti.</p>
              <p>Hai
                <b-badge variant="info">{{data.n_funzioni_incomplete}}</b-badge>
                <!-- Questo è amore per l'utente, se è 1 scrivo Funzione, altrimenti Funzioni -->
                {{data.n_funzioni_incomplete | formatFunzioni}}
                incomplete.</p>
            </div>
            <hr/>
            <b-col class="text-center">
              <b-button @click="logout">Logout</b-button>
            </b-col>
          </b-col>
      </b-row>
  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import Menu from '@/components/ui/Menu'
import { deleteCookie } from '@/assets/js/cookie'
import axios from 'axios'
import qs from 'qs'

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
    IDInEsaurimento () {
      try {
        return Number(this.data.id_max) -
          Number(this.data.ultimo_id_bene) < 50
      } catch (err) { return false }
    }
  },
  methods: {
    getData () {
      axios.post(this.$store.getters.userStatsURL,
        qs.stringify({
          username: this.$store.getters.getUserData.username,
          password: this.$store.getters.getUserData.password
        })).then(function (resp) {
        this.data = resp.data
      }.bind(this))
    },
    logout () {
      // cancello il cookie con i dati utente (se presente)
      deleteCookie('userData')
      // dico a Vuex di cancellare i dati utente
      this.$store.commit('registerUser', {})
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
.badge {
  font-size: 100%;
}
</style>
