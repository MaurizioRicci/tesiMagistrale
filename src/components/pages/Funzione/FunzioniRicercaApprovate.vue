<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
        <b-col>
          <h2 v-if="!noTitle">{{title || 'Ricerca/Modifica funzioni'}}</h2>
        </b-col>
      </b-row>
      <b-row>
          <b-col>
              <ricerca-funzioni-approvate/>
          </b-col>
      </b-row>
  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import Menu from '@/components/ui/Menu'
import RicercaFunzioniApprovate from '@/components/ui/RicercaFunzioniApprovate'

export default {
  name: 'FunzioniRicercaApprovate',
  components: {Menu, RicercaFunzioniApprovate},
  mixins: [commonPageMixin],
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
