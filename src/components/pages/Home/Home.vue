<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
        <b-col>
          <h2 v-if="!noTitle">{{title || 'Home page'}}</h2>
        </b-col>
      </b-row>
      <b-row class="mt-3" align-h="center">
          <b-col class="text-left" cols="3">
            <h5>Benvenuto
              <b-badge variant="info">{{$store.getters.getUserData.username}}</b-badge>
            </h5>
            <h5>Info e statistiche</h5>
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
               in attesa di correzione.</p>
            <p>Hai
              <b-badge variant="info">{{data.n_funzioni_da_correggere}}</b-badge>
              <!-- Questo è amore per l'utente, se è 1 scrivo Funzione, altrimenti Funzioni -->
              {{data.n_funzioni_da_correggere | formatFunzioni}}
              in attesa di correzione.</p>
            <p>Hai
              <b-badge variant="info">{{data.n_beni_incompleti}}</b-badge>
              <!-- Questo è amore per l'utente, se è 1 scrivo Bene, altrimenti Beni -->
              {{data.n_beni_incompleti | formatBeni}}>
               incompleti.</p>
            <p>Hai
              <b-badge variant="info">{{data.n_funzioni_incomplete}}</b-badge>
              <!-- Questo è amore per l'utente, se è 1 scrivo Funzione, altrimenti Funzioni -->
              {{data.n_funzioni_incomplete | formatFunzioni}}
               incomplete.</p>
          </b-col>
      </b-row>
  </b-container>
</template>

<script>
import pageCommonMixin from '@/components/mixins/PageCommon'
import Menu from '@/components/ui/Menu'
import axios from 'axios'
import qs from 'qs'

export default {
  name: 'Home',
  components: {Menu},
  mixins: [pageCommonMixin],
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
        return Number(this.data.ultimo_id_bene) /
        Number(this.data.id_max) >= 0.7
      } catch (err) { return false }
    }
  },
  methods: {
    getData () {
      axios.post(this.$store.getters.userStatsURL,
        qs.stringify({
          username: this.$store.getters.getUserData.username,
          password: this.$store.getters.getUserData.password,
          switch_bene: this.cercaInArchivioTemp ? 'miei_temp' : 'miei_aggiunti'
        })).then(function (resp) { this.data = resp.data }.bind(this))
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
