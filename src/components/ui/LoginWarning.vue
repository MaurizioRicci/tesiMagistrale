<template>
  <b-alert :show="showError" variant="danger">
    Not logged in. <router-link to="/">Login</router-link>
  </b-alert>
</template>

<script>
// Mostra un avviso se non si è loggati
export default {
  name: 'LoginWarning',
  computed: {
    showError () {
      return !this.$store.getters.loggedIn
    }
  }
}
</script>
