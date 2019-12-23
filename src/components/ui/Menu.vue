<template>
  <b-container fluid class="myMenu p-0">
    <b-navbar toggleable="lg" type="dark" variant="info" class="mb-1">
      <b-navbar-brand to="/home">Home</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav class="w-100">
          <b-container fluid>
          <b-row>
            <b-col>
            <b-nav-item-dropdown text="Beni" class="d-inline-block">
              <b-dropdown-item to="/bene/aggiungi">Aggiungi un bene</b-dropdown-item>
              <b-dropdown-item to="/bene/dettagli_bene">Visualizza un bene</b-dropdown-item>
              <b-dropdown-item to="/bene/ricerca">Ricerca/Modifica beni</b-dropdown-item>
            </b-nav-item-dropdown>
            </b-col>

            <b-col>
            <b-nav-item-dropdown text="Funzioni" class="d-inline-block">
              <b-dropdown-item to="/funzione/aggiungi">Aggiungi una funzione</b-dropdown-item>
              <b-dropdown-item to="/funzione/ricerca">Ricerca/Modifica funzioni</b-dropdown-item>
            </b-nav-item-dropdown>
            </b-col>

            <b-col>
            <b-nav-item-dropdown text="Il mio lavoro" class="d-inline-block">
              <b-dropdown-item to="/bene/mio_lavoro">I miei beni</b-dropdown-item>
              <b-dropdown-item to="/funzione/mio_lavoro">Le mie funzioni</b-dropdown-item>
            </b-nav-item-dropdown>
            </b-col>

            <b-col >
              <b-navbar-nav>
                <b-nav-item to="/">
                  <span style="color:white;" :class="{'text-warning': !currUsername}"
                  v-b-tooltip.hover.bottom="loginTooltip">
                  User: {{currUsername || '???'}}
                  </span>
                </b-nav-item>
              </b-navbar-nav>
            </b-col>
          </b-row>
          </b-container>

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </b-container>
</template>

<script>
// E' il menu dell'applicazione
export default {
  name: 'SiteMenu',
  computed: {
    currUsername: function () {
      return this.$store.getters.getUserData.username
    },
    loginTooltip: function () {
      return this.currUsername ? 'Ciao ' + this.currUsername : 'login'
    }
  }
}
</script>

<style>
.myMenu .nav-link { color: white !important; }
.myMenu .nav-item:hover { background-color: #114e61; border-radius: 5px; }
</style>
