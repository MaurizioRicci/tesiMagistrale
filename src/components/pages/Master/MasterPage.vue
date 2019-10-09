<template>
  <b-container fluid class="p-0">
    <slot>
    </slot>
    <!-- Modal per mostrare possibili errori all'utente -->
    <b-modal ref="master-page-show-error"
     :title="errorData.title" ok-only>
        <p class="my-2">{{errorData.message}}</p>
    </b-modal>

  </b-container>
</template>

<script>
export default {
  name: 'MasterPage',
  data () {
    return {
      errorData: {
        title: '',
        message: ''
      }
    }
  },
  methods: {
    // assegnamento di destrutturazione array con valori di default
    showError: function ([title = '', msg = '']) {
      this.errorData.title = title
      this.errorData.message = msg
      this.$refs['master-page-show-error'].show()
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
