<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu">
        <Menu/>
      </b-col>
      <b-col>
        <h2 v-if="!noTitle">{{title || 'Visualizza un bene'}}</h2>
        <b-alert show v-if="form.msg_validatore" variant="primary">
          Da rivedere: {{form.msg_validatore}}
        </b-alert>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <transition name="slide-fade" v-on:leave="mapCols = 12">
        <b-col cols="8" v-show="12-mapCols > 0">

          <BeneFormView :form="form"
            :disallowIDChange="disallowIDChange"
            @requestedId="id => fetchBeneDataByID(id)"/>
          <b-button type="submit" variant="primary" @click="goBack">Indietro</b-button>
          <!-- si modificano solo beni definitivi -->
          <b-button type="reset" variant="danger" @click="onEdit"
            v-if="!cercaInArchivioTemp">Modifica</b-button>

        </b-col>
      </transition>
      <b-col :cols="mapCols">
        <MyMap ref="myMap" locked v-model="form.polygon"
          :center="mapCenter" :zoom="17" @ingrandisci-mappa="ingrandisciMappa"
          @rimpicciolisci-mappa="rimpicciolisciMappa"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Menu from '@/components/ui/Menu'
import MyMap from '@/components/ui/Map'
import BeneFormView from '@/components/ui/BeneFormView'
import commonPageMixin from '@/components/mixins/CommonPage'
import dettagliBeneMixin from '@/components/mixins/DettagliBene'
import '@/assets/css/slideFadeTransition.css'

export default {
  name: 'VisualizzaBene',
  components: { Menu, MyMap, BeneFormView },
  mixins: [commonPageMixin, dettagliBeneMixin],
  data () {
    return {
      mapCols: 4
    }
  },
  props: {
    // possibilità di scrivere un id da cercare
    disallowIDChange: Boolean
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
      this.$router.push('/bene/modifica/' + this.formRetrived.id)
    },
    init () {
      this.fetchBeneDataByID(this.idBene, this.idUtente, this.cercaInArchivioTemp)
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
