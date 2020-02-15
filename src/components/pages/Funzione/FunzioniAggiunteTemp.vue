<template>
  <b-container fluid>
    <LoadingOverlay :open="loading"/>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <h2 v-if="!noTitle">{{title || 'Gestione funzioni'}}</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-tabs pills card align="center">
          <b-tab title="Funzioni tue archivio definitivo">
            <FunzioniUtente :update.sync="triggerUpdate"
              @loading="loading=true" @loaded="loading=false"
              @loadingFailed="loading=false"/>
          </b-tab>
          <b-tab title="Altre funzioni utente" active>
            <FunzioniUtente cercaInArchivioTemp :update.sync="triggerUpdate"
              @loading="loading=true" @loaded="loading=false"
              @loadingFailed="loading=false"/>
            <b-button v-if="role==='schedatore'"
              @click="waitUserConfirmation=true">Invia per il controllo</b-button>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
    <b-toast id="confirm-toast" title="Richiesta conferma" solid no-auto-hide
      toaster="b-toaster-bottom-center" variant="secondary" v-model="waitUserConfirmation">
      <div class="row justify-content-center">
        <div class="col-12">
          <p>Le funzioni pronte verranno inviate al controllo,
            fintanto che saranno in attesa revisione non potrai modificarle
          </p>
        </div>
        <div class="col-auto">
          <b-button @click="mettiInRevisione">Conferma</b-button>
        </div>
      </div>
    </b-toast>
  </b-container>
</template>

<script>
import Menu from '@/components/ui/Menu'
import commonPageMixin from '@/components/mixins/CommonPage'
import FunzioniUtente from '@/components/ui/FunzioniUtente'
import LoadingOverlay from '@/components/ui/LoadingOverlay'
import axios from 'axios'
import qs from 'qs'

// @group Pages
export default {
  name: 'FunzioniAggiunteTemp',
  mixins: [commonPageMixin],
  components: { Menu, FunzioniUtente, LoadingOverlay },
  computed: {
    role: function () { return this.$store.getters.getUserData.role },
    caption: function () {
      return this.role === 'schedatore'
        ? 'Qua ci sono le funzioni utente che sono o in revisione, o da rivedere o che sono incomplete.'
        : 'Qua ci sono le funzioni da revisionare.'
    }
  },
  data: function () {
    return {
      waitUserConfirmation: false,
      triggerUpdate: false,
      loading: false
    }
  },
  methods: {
    mettiInRevisione () {
      let postData = this.$store.getters.getUserData
      let storeGetters = this.$store.getters
      let url = storeGetters.funzioniMettiInRevisioneURL
      axios.post(url, qs.stringify(postData))
        .then(ok => {
          this.$vueEventBus.$emit('master-page-show-msg', ['Risposta', 'Funzioni inviate al revisore.'])
          this.$vueEventBus.$once('master-page-show-msg-ok',
            () => {
              // se tutto va bene nascondo la finestra di conferma
              this.waitUserConfirmation = false
              this.triggerUpdate = true
            })
        }, fail => {
          this.$vueEventBus.$emit('master-page-show-msg', ['Errore', fail.response.data.msg])
        })
    }
  }
}
</script>
