<template>
  <b-container fluid class="p-0">
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
