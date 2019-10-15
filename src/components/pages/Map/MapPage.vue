<template>
  <b-container fluid>
      <b-row>
        <b-col>
          <h2>Mappa</h2>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col cols="12">
            <MyMap v-if="mapCenter" :zoom="16" height="700px"
            :center="mapCenter" locked
            v-model="polygonChoosen"></MyMap>
        </b-col>
        <b-col cols="6" v-if="polygonChoosen.countVertex()">
            <b-list-group>
                <p class="m-auto">Punti scelti</p>
                <b-list-group-item v-for="(point, index) in polygonChoosen.getLatLngs()"
                v-bind:key="index">
                <b-row align-h="center">
                    <b-col cols="6">{{index + 1}}) {{point[0]}}, {{point[1]}}</b-col>
                </b-row>
                </b-list-group-item>
            </b-list-group>
        </b-col>
      </b-row>
  </b-container>
</template>

<script>
import MyMap from '@/components/ui/Map'
import { Polygon, MultiPolygon } from '@/assets/js/multiPolygonModel'
const axios = require('axios')

export default {
  name: 'MapPage',
  components: { MyMap },
  props: {
    id: String
  },
  data () {
    return {
      polygonChoosen: new Polygon(),
      mapCenter: null
    }
  },
  methods: {
    fetchData () {
      const T = this
      // fare richiesta dati del bene con id nella url
      axios.get(this.$store.getters.dettagliBeneURL, {
        params: { 'id': this.id }
      }).then(ok => {
        if (ok.data.length <= 0) {
          this.$vueEventBus.$emit('master-page-show-error', ['Info', 'No result found'])
        } else {
          let geojson = ok.data[0].geojson
          T.polygonChoosen = new MultiPolygon()
            .buildFromGeoJSON(geojson).findPolygonByIndex(0)
          T.mapCenter = ok.data[0].centroid.coordinates
          // geoJSON usa [longitude, latitude] mentre leaflet usa [latitude, longitude]
          // occorre fare lo scambio
          T.mapCenter = [T.mapCenter[1], T.mapCenter[0]]
        }
      }).catch(error => {
        let msg = (error.response && error.response.data.msg) || error.message
        this.$vueEventBus.$emit('master-page-show-error', ['Error', msg])
      })
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    $route (to, from) {
      this.fetchData()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-group {
    text-align: left
}
</style>
