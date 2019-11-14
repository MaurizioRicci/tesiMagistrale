<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
        <b-col>
          <LoginWarning/>
          <b-alert variant="success" :show="serverRespOk">Bene creato/aggiunto</b-alert>
          <h2 v-if="!noTitle">{{title || 'Aggiungi/Modifica un bene'}}</h2>
        </b-col>
      </b-row>
  </b-container>
</template>

<script>
import pageCommonMixin from '@/components/mixins/PageCommon'
import Menu from '@/components/ui/Menu'

export default {
  name: 'HelloWorld',
  components: {Menu},
  mixins: [pageCommonMixin],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
