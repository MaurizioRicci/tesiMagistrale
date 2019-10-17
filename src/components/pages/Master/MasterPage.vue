<template>
  <b-container fluid class="p-0">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="home">Home</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav class="w-100">
          <b-col cols="4">
          <b-nav-item-dropdown text="Beni" class="d-inline-block">
            <b-dropdown-item href="#">Aggiungi un bene</b-dropdown-item>
            <b-dropdown-item href="#">Modifica un bene</b-dropdown-item>
            <b-dropdown-item href="#">Visualizza un bene</b-dropdown-item>
            <b-dropdown-item href="#">Visualizza beni</b-dropdown-item>
          </b-nav-item-dropdown>
          </b-col>

          <b-col cols="4">
          <b-nav-item-dropdown text="Funzioni" class="d-inline-block">
            <b-dropdown-item href="#">Aggiungi una funzione</b-dropdown-item>
            <b-dropdown-item href="#">Modifica una funzione</b-dropdown-item>
            <b-dropdown-item href="#">Visualizza una funzione</b-dropdown-item>
            <b-dropdown-item href="#">Visualizza funzioni</b-dropdown-item>
          </b-nav-item-dropdown>
          </b-col>

          <b-col cols="4">
          <b-nav-item-dropdown text="Valida" class="d-inline-block">
            <b-dropdown-item href="#">Valida un bene</b-dropdown-item>
            <b-dropdown-item href="#">Valida una funzione</b-dropdown-item>
          </b-nav-item-dropdown>
          </b-col>

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <slot>
    </slot>
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
