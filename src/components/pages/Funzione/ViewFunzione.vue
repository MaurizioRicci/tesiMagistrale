<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <h2 v-if="!noTitle">{{title || 'Visualizza una funzione'}}</h2>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <transition name="slide-fade" v-on:leave="mapCols = 12">
        <b-col cols="8" v-show="12-mapCols > 0">

          <FunzioneFormView :form="form"/>
          <b-button type="submit" variant="primary" @click="goBack">Indietro</b-button>
          <!-- si modificano solo beni definitivi -->
          <b-button type="reset" variant="danger" @click="onEdit"
            v-if="!cercaInArchivioTemp">Modifica</b-button>

        </b-col>
      </transition>
      <b-col :cols="mapCols">
        <MyMap ref="myMap" locked
          :center="mapCenter" :zoom="17" @ingrandisci-mappa="ingrandisciMappa"
          @rimpicciolisci-mappa="rimpicciolisciMappa"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Menu from '@/components/ui/Menu'
import MyMap from '@/components/ui/Map'
import FunzioneFormView from '@/components/ui/FunzioneFormView'
import commonPageMixin from '@/components/mixins/CommonPage'
import dettagliFunzioneMixin from '@/components/mixins/DettagliFunzione'
import '@/assets/css/slideFadeTransition.css'

export default {
  name: 'VisualizzaFunzione',
  components: { Menu, MyMap, FunzioneFormView },
  mixins: [commonPageMixin, dettagliFunzioneMixin],
  data () {
    return {
      mapCols: 4
    }
  },
  methods: {
    ingrandisciMappa () {
      this.mapCols = 12
      this.$nextTick(() => this.$refs.myMap.invalidateSize())
    },
    rimpicciolisciMappa () {
      this.mapCols = 4
      this.$nextTick(() => this.$refs.myMap.invalidateSize())
    },
    onEdit () {
      this.$router.push('/funzione/modifica/' + this.formRetrived.id)
    }
  },
  created () {
    this.fetchFunzioneDataByID(this.idFunzione, this.idUtente)
  },
  watch: {
    $route (to, from) {
      this.fetchFunzioneDataByID(this.idFunzione, this.idUtente)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
