<template>
  <div id="app">
    <!-- Modal per mostrare possibili errori all'utente -->
    <b-modal v-for="(msg, index) in msgData" :key="index"
      :title="msg.title" ok-only v-model="msg.modalShow"
      @ok="emitOkBtnClicked(index)">
        <p class="my-2">{{msg.msg}}</p>
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
      msgData: []
    }
  },
  methods: {
    // assegnamento di destrutturazione array con valori di default
    showMsg: function ([title = '', msg = '', msgID = '']) {
      // aggiungo i dati del messaggio da mostrare alla lista degli altri messaggi attivi
      this.msgData.push({ id: msgID, title: title, msg: msg, modalShow: true })
    },
    emitOkBtnClicked (index) {
      // se il messaggio ha un id lo aggiungo al nome dell'evento
      let suffix = this.msgData[index].id ? '-' + this.msgData[index].id : ''
      this.$vueEventBus.$emit('master-page-show-msg-ok' + suffix)
      this.msgData = this.msgData.filter((el, idx) => idx !== index)
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
