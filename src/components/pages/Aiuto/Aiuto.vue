<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <h2 v-if="!noTitle">{{title || 'Aiuto'}}</h2>
      </b-col>
    </b-row>
    <b-row>
    <b-col>
      <b-tabs pills card align="center">
        <b-tab title="Beni" active>
          <b-row>
            <b-col cols="12" md="6" xl>
              <b-card title="Aggiungi bene" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl>
              <b-card title="Visualizza un bene" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl>
              <b-card title="Ricerca un bene" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Funzioni">
            <b-row>
            <b-col cols="12" md="6" xl>
              <b-card title="Aggiungi una funzione" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl>
              <b-card title="Visualizza una funzione" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl>
              <b-card title="Ricerca una funzione" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Mio lavoro">
            <b-row align-h="center">
            <b-col cols="12" md="6" xl="4">
              <b-card title="Aggiungi bene" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl="4">
              <b-card title="Visualizza un bene" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-col>
    </b-row>
  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import Menu from '@/components/ui/Menu'

// Io sono solo un componente da cui copiare il template ogni volta.
export default {
  name: 'AiutoPage',
  components: { Menu },
  mixins: [commonPageMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
