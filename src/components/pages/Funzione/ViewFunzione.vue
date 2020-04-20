<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <h2 v-if="!noTitle">{{title || 'Visualizza una funzione'}}</h2>
        <b-alert show v-if="form.msg_validatore" variant="primary"
          style="max-height:30vh; overflow:auto;">
          Da rivedere: {{form.msg_validatore}}
        </b-alert>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="8">

          <FunzioneFormView :form="form"/>
          <b-button type="button" @click="goBack">Indietro</b-button>
          <!-- si modificano solo beni definitivi -->
          <b-button type="reset" variant="danger" @click="onEdit"
            v-if="!cercaInArchivioTemp">Modifica</b-button>

      </b-col>

      <b-col cols="4">
        <MyMap ref="myMap" locked :center="mapCenter" :zoom="17"/>
      </b-col>
    </b-row>
      <b-col>
        <RicercaBeniApprovati/>
      </b-col>
  </b-container>
</template>

<script>
import Menu from '@/components/ui/Menu'
import MyMap from '@/components/ui/Map'
import FunzioneFormView from '@/components/ui/FunzioneFormView'
import commonPageMixin from '@/components/mixins/CommonPage'
import dettagliFunzioneMixin from '@/components/mixins/DettagliFunzione'
import RicercaBeniApprovati from '@/components/ui/RicercaBeniApprovati'

// @group Pages
export default {
  name: 'VisualizzaFunzione',
  components: { Menu, MyMap, FunzioneFormView, RicercaBeniApprovati },
  mixins: [commonPageMixin, dettagliFunzioneMixin],
  data () {
    return {}
  },
  methods: {
    onEdit () {
      this.$router.push('/funzione/modifica/' + this.formRetrived.id)
    },
    init () {
      this.fetchFunzioneDataByID(this.idFunzione, this.idUtente, this.cercaInArchivioTemp)
    }
  },
  created () {
    this.init()
  },
  watch: {
    $route (to, from) {
      this.init()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
