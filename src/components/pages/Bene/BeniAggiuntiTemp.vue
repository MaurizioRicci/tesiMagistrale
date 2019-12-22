<template>
  <b-container fluid>
    <LoadingOverlay :open="update"/>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <h2 v-if="!noTitle">{{title || 'Gestione beni'}}</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-tabs pills card align="center">
          <b-tab title="Beni tuoi archivio definitivo">
            <BeniUtente :update.sync="update"/>
          </b-tab>
          <b-tab title="Altri Beni utente" active>
            <p>Qua ci sono i beni utente che sono o in revisione, o da rivedere o che sono incompleti.</p>
            <BeniUtente v-if="role==='schedatore'"
              cercaInArchivioTemp :update.sync="update"/>
            <b-button @click="waitUserConfirmation=true">Invia per il controllo</b-button>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
    <b-toast id="confirm-toast" title="Richiesta conferma" solid no-auto-hide
      toaster="b-toaster-bottom-full" variant="secondary" v-model="waitUserConfirmation">
      <div class="">
        <div class="row justify-content-center">
          <p>I beni pronti verranno inviati al controllo,
            fintanto che saranno in attesa revisione non potrai modificarli
          </p>
        </div>
        <div class="row justify-content-center">
          <b-button @click="mettiInRevisione">Conferma</b-button>
        </div>
      </div>
    </b-toast>
  </b-container>
</template>

<script>
import Menu from '@/components/ui/Menu'
import commonPageMixin from '@/components/mixins/CommonPage'
import BeniUtente from '@/components/ui/BeniUtente'
import LoadingOverlay from '@/components/ui/LoadingOverlay'
const axios = require('axios')
const qs = require('qs')

export default {
  name: 'BeniAggiuntiTemp',
  mixins: [commonPageMixin],
  components: { Menu, BeniUtente, LoadingOverlay },
  data: function () {
    return {
      waitUserConfirmation: false,
      update: false,
      role: this.$store.getters.getUserData.role
    }
  },
  methods: {
    mettiInRevisione () {
      let postData = this.$store.getters.getUserData
      let storeGetters = this.$store.getters
      let url = storeGetters.beniMettiInRevisioneURL
      axios.post(url, qs.stringify(postData))
        .then(ok => {
          this.$vueEventBus.$emit('master-page-show-msg', ['Risposta', 'Ok'])
          this.$vueEventBus.$once('master-page-show-msg-ok',
            () => {
              // se tutto va bene nascondo la finestra di conferma
              this.waitUserConfirmation = false
              this.update = true
            })
        }, fail => {
          this.$vueEventBus.$emit('master-page-show-msg', ['Errore', fail.response.data.msg])
        })
    }
  }
}
</script>
