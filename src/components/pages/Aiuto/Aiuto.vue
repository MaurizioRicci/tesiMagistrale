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
        <!-- aiuto beni -->
        <b-tab title="Beni" active>
          <b-row>
            <!-- d-flex perchè flex hanno la stessa altezza tutti -->
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Aggiungi bene" tag="article" class="mb-2">
               In questa pagina è possibile aggiungere un bene, ovvero una entità geografica. Tale entità potrà
               essere collegata a un'altra per mezzo di una funzione (a tal proposito vedi aiuto funzioni).
               Il bene aggiunto dovra essere prima approvato da un revisore; nel caso un revisore aggiunga un bene, esso
               verrà aggiunto subito alla lista dei beni comuni a tutti gli utenti (detti beni definitivi).
                <div slot="footer"><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Visualizza un bene" tag="article" class="mb-2">
              Questa pagina permette di visualizzare un bene specifico dato un identificativo (un numero intero detto ID).
                <div slot="footer"><b-button href="#" variant="primary" class="">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Ricerca un bene" tag="article" class="mb-2">
                Puoi ricercare, visualizzare e modificare un bene approvato per mezzo di questa pagina. Utilizza i filtri della tabella per ricercare.
                Nella tabella premendo il pulsante + è possibile anche aprire la mappa e vedere l'ubicazione del bene.
                <div slot="footer"><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <!-- aiuto Funzioni -->
        <b-tab title="Funzioni">
            <b-row>
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Aggiungi una funzione" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div slot="footer"><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Visualizza una funzione" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div slot="footer"><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl class="d-flex">
              <b-card title="Ricerca una funzione" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div slot="footer"><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
        <!-- aiuto mio lavoro -->
        <b-tab title="Mio lavoro">
            <b-row align-h="center">
            <b-col cols="12" md="6" xl="4" class="d-flex">
              <b-card title="Aggiungi bene" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div slot="footer"><b-button href="#" variant="primary">Visita pagina</b-button></div>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" xl="4" class="d-flex">
              <b-card title="Visualizza un bene" tag="article" class="mb-2">
                Some quick example text to build on the card title and make up the bulk of the card's content.
                <div slot="footer"><b-button href="#" variant="primary">Visita pagina</b-button></div>
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
.card-footer {
  padding: 7px;
}
</style>
