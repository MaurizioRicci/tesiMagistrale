<template>
  <div id="app">
    <!-- Modal per mostrare possibili errori all'utente -->
    <b-modal :title="msgData.title" ok-only v-model="modalShow"
      @ok="emitOkBtnClicked">
        <p class="my-2">{{msgData.message}}</p>
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
      msgData: {
        title: '',
        message: ''
      }
    }
  },
  methods: {
    // assegnamento di destrutturazione array con valori di default
    showMsg: function ([title = '', msg = '']) {
      // evito di mostrare più volte stesso messaggio se già aperto
      // se non è aperto apro. Se è aperto apro solo se title & message sono diversi
      if (!this.modalShow || (this.modalShow && this.msgData.title !== title &&
       this.msgData.message !== msg)) {
        this.msgData.title = title
        this.msgData.message = msg
        this.modalShow = true
      }
    },
    emitOkBtnClicked () {
      this.$vueEventBus.$emit('master-page-show-msg-ok')
    }
  },
  created () {
    this.$vueEventBus.$on('master-page-show-msg', this.showMsg)
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
  margin-bottom: 5px;
}
</style>
