<template>
  <b-container fluid class="p-0">
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
              <b-dropdown-item to="/funzione/">Aggiungi una funzione</b-dropdown-item>
              <!-- Visualizza poi va tolto dal menu -->
              <b-dropdown-item to="/funzione/dettagli_funzione/2">Visualizza una funzione</b-dropdown-item>
              <b-dropdown-item to="/funzione/">Ricerca/Modifica funzioni</b-dropdown-item>
            </b-nav-item-dropdown>
            </b-col>

            <b-col>
            <b-nav-item-dropdown text="Il mio lavoro" class="d-inline-block">
              <b-dropdown-item to="/mio_lavoro_beni">I miei beni</b-dropdown-item>
              <b-dropdown-item to="#">Le mie funzioni</b-dropdown-item>
            </b-nav-item-dropdown>
            </b-col>

            <b-col cols="1" class="ml-auto">
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
