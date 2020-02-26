<template>
  <b-container fluid class="myMenu p-0">
    <b-navbar toggleable="lg" type="dark" variant="info" class="mb-1">
      <b-navbar-brand to="/home" title="Home">
          <font-awesome-icon icon="home" size="lg" style="color: white;"/>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="w-100" align="center">
        <b-nav-item-dropdown text="Beni" class="d-inline-block">
        <b-dropdown-item to="/bene/aggiungi">Aggiungi un bene</b-dropdown-item>
        <b-dropdown-item to="/bene/dettagli_bene">Visualizza un bene specifico</b-dropdown-item>
        <b-dropdown-item to="/bene/ricerca">Ricerca/Modifica beni</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="w-100" align="center">
        <b-nav-item-dropdown text="Funzioni" class="d-inline-block">
          <b-dropdown-item to="/funzione/aggiungi">Aggiungi una funzione</b-dropdown-item>
          <b-dropdown-item to="/funzione/ricerca">Ricerca/Modifica funzioni</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="w-100" align="center">
        <b-nav-item-dropdown text="Il lavoro" class="d-inline-block">
          <b-dropdown-item to="/bene/mio_lavoro">Beni</b-dropdown-item>
          <b-dropdown-item to="/funzione/mio_lavoro">Funzioni</b-dropdown-item>
      </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav class="w-100" align="center">
        <b-nav-text v-b-tooltip.hover.bottom="loginTooltip">
          <span style="color:white;" :class="{'text-warning': !currUsername}">
            User: {{currUsername || '???'}}
          </span>
        </b-nav-text>
      </b-navbar-nav>

      <b-navbar-nav class="w-100" align="center">
        <b-nav-item to="/aiuto">
          Aiuto
        </b-nav-item>
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
