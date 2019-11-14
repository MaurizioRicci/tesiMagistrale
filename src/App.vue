<template>
  <div id="app">
    <!-- Modal per mostrare possibili errori all'utente -->
    <b-modal :title="errorData.title" ok-only v-model="modalShow">
        <p class="my-2">{{errorData.message}}</p>
    </b-modal>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
}
</style>
