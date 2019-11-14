<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
        <b-col>
          <LoginWarning/>
          <h2 v-if="!noTitle">{{title || 'Gestione beni'}}</h2>
        </b-col>
      </b-row>
      <b-row>
    <b-tabs pills card align="center">
      <b-tab title="Beni aggiunti" active>
        <BeniUtente/>
        </b-tab>
      <b-tab title="Beni in revisione">
          <BeniUtente cercaInRevisione/>
      </b-tab>
    </b-tabs>
      </b-row>
  </b-container>
</template>

<script>
import pageCommonMixin from '@/components/mixins/PageCommon'
import BeniUtente from '@/components/ui/BeniUtente'
export default {
  name: 'BeniAggiuntiInRevisione',
  mixins: [pageCommonMixin],
  components: { BeniUtente }
}
</script>
