<template>
    <div>
        <b-alert :show="showError" variant="danger">
          Not logged in. <router-link to="/">Login</router-link>
        </b-alert>
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'LoginWarning',
  computed: {
    showError () {
      return !this.$store.getters.loggedIn
    }
  }
}
</script>
