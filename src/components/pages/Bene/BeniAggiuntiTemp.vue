<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
        <b-col>
          <h2 v-if="!noTitle">{{title || 'Gestione beni'}}</h2>
        </b-col>
      </b-row>
      <b-row>
      <b-col>
    <b-tabs pills card align="center">
      <b-tab title="Beni aggiunti" active>
        <BeniUtente/>
        </b-tab>
      <b-tab title="Altri Beni utente">
          <p>Qua ci sono i beni utente che sono o in revisione, o da rivedere o che sono incompleti.</p>
          <BeniUtente cercaInArchivioTemp/>
      </b-tab>
    </b-tabs>
      </b-col>
      </b-row>
  </b-container>
</template>

<script>
import Menu from '@/components/ui/Menu'
import commonPageMixin from '@/components/mixins/CommonPage'
import BeniUtente from '@/components/ui/BeniUtente'
export default {
  name: 'BeniAggiuntiTemp',
  mixins: [commonPageMixin],
  components: { Menu, BeniUtente }
}
</script>
