<template>
  <b-container fluid class="p-0">
    <b-navbar toggleable="lg" type="dark" variant="info" class="mb-1">
      <b-navbar-brand to="home">Home</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav class="w-100">
          <b-container>
          <b-row align-h="center">
            <b-col>
            <b-nav-item-dropdown text="Beni" class="d-inline-block">
              <b-dropdown-item to="/bene">Aggiungi un bene</b-dropdown-item>
              <b-dropdown-item to="/bene">Modifica un bene</b-dropdown-item>
              <b-dropdown-item to="/dettagli_bene">Visualizza un bene</b-dropdown-item>
              <b-dropdown-item to="/ricerca_beni">I miei beni</b-dropdown-item>
            </b-nav-item-dropdown>
            </b-col>

            <b-col>
            <b-nav-item-dropdown text="Funzioni" class="d-inline-block">
              <b-dropdown-item to="#">Aggiungi una funzione</b-dropdown-item>
              <b-dropdown-item to="#">Modifica una funzione</b-dropdown-item>
              <b-dropdown-item to="#">Visualizza una funzione</b-dropdown-item>
              <b-dropdown-item to="#">Ricerca funzioni</b-dropdown-item>
            </b-nav-item-dropdown>
            </b-col>

            <b-col>
            <b-nav-item-dropdown text="Valida" class="d-inline-block">
              <b-dropdown-item to="#">Valida un bene</b-dropdown-item>
              <b-dropdown-item to="#">Valida una funzione</b-dropdown-item>
            </b-nav-item-dropdown>
            </b-col>
          </b-row>
          </b-container>

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
<!--     Possiede sia uno slot che un router-view in base a come si vogliono passare i dati;
    se nel modo tradizionale di Vue oppure se si è definita una route con Vue-Router -->
    <slot>
    </slot>
    <router-view></router-view>
    <!-- Modal per mostrare possibili errori all'utente -->
    <b-modal :title="errorData.title" ok-only v-model="modalShow">
        <p class="my-2">{{errorData.message}}</p>
    </b-modal>

  </b-container>
</template>

<script>
export default {
  name: 'MasterPage',
  data () {
    return {
      modalShow: false,
      errorData: {
        title: '',
        message: ''
      }
    }
  },
  methods: {
    // assegnamento di destrutturazione array con valori di default
    showError: function ([title = '', msg = '']) {
      // evito di mostrare più volte stesso messaggio se già aperto
      // se non è aperto apro. Se è aperto apro solo se title & message sono diversi
      if (!this.modalShow || (this.modalShow && this.errorData.title !== title &&
       this.errorData.message !== msg)) {
        this.errorData.title = title
        this.errorData.message = msg
        this.modalShow = true
      }
    }
  },
  created () {
    this.$vueEventBus.$on('master-page-show-error', this.showError)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
