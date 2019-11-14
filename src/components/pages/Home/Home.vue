<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
        <b-col>
          <h2 v-if="!noTitle">{{title || 'Home page'}}</h2>
        </b-col>
      </b-row>
      <b-row class="mt-3" align-h="center">
          <b-col class="text-left" cols="10">
            <h5>Benvenuto {{$store.getters.getUserData.username}}</h5>
            <h5>Info e statistiche</h5>
            <p>Gli ID a te riservati variano da XXX a XXX</p>
            <p>Il tuo ultimo ID usato per un Bene è XXX</p>
            <p>Il tuo ultimo ID usato per una Funzione è XXX</p>
            <p>Hai XXX Beni in attesa di revisione</p>
            <p>Hai XXX Funzioni in attesa di revisione</p>
            <p>Hai XXX Beni rivisti in attesa di correzione</p>
            <p>Hai XXX Funzioni riviste in attesa di correzione</p>
          </b-col>
      </b-row>
  </b-container>
</template>

<script>
import pageCommonMixin from '@/components/mixins/PageCommon'
import Menu from '@/components/ui/Menu'

export default {
  name: 'Home',
  components: {Menu},
  mixins: [pageCommonMixin],
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
