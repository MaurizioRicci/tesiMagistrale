<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
        <b-col>
          <h2 v-if="!noTitle">{{title || 'Opzioni mappa'}}</h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="8" class="m-auto">
            <h5>Clicca su una regione per scegliere il centro della mappa per future visualizzazioni.</h5>
            <l-map :zoom="zoom" :center="center"
                @update:center="invalidateSize"
                style="width:70vw;height:70vh" ref="myMap">
                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                     <l-geo-json :geojson="geoJson" @click="handleClick"></l-geo-json>
                     <l-marker :lat-lng="popUp.position" @update:lat-lng="panToPoint"
                        ref="myMarker">
                        <l-popup>
                            <p>{{popUp.txt}}</p>
                            <b-button @click="salvaCentroide">Salva</b-button>
                        </l-popup>
                     </l-marker>
            </l-map>
        </b-col>
      </b-row>
  </b-container>
</template>

<script>
import commonPageMixin from '@/components/mixins/CommonPage'
import Menu from '@/components/ui/Menu'
import { LMap, LTileLayer, LGeoJson, LMarker, LPopup } from 'vue2-leaflet'
import axios from 'axios'

export default {
  name: 'MapOptions',
  components: { Menu, LMap, LTileLayer, LGeoJson, LMarker, LPopup },
  mixins: [commonPageMixin],
  data () {
    return {
      zoom: 6,
      center: this.$store.getters.getDefaultMapCenter,
      leafletMapObject: null,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      geoJson: null,
      popUp: {
        position: [0, 0],
        txt: ''
      }
    }
  },
  methods: {
    handleClick (evt) {
      if (evt.layer && evt.layer.feature && evt.layer.feature.properties) {
        let feature = evt.layer.feature
        this.popUp.txt = feature.properties.den_uts
        let jsonCentroid = JSON.parse(feature.properties.centr)
        this.popUp.position = jsonCentroid.coordinates
        // layer.bindPopup('<p>' + feature.properties.den_uts + '</p>' + '<button @click="getData">Salva</button>')
      }
    },
    // @vuese
    // chiama invalidateSize() di Leaflet
    invalidateSize: function () {
      this.leafletMapObject.invalidateSize()
    },
    getData () {
      axios.get(this.$store.getters.elencoProvinceURL)
        .then(ok => { this.geoJson = ok.data })
    },
    salvaCentroide () {
      this.$store.commit('setMapCenter', this.popUp.position)
      this.$store.dispatch('asyncSaveOptions')
      this.goBack()
    },
    openPopUp () {
      this.$refs.myMarker.mapObject.openPopup()
    },
    panToPoint () {
      this.openPopUp()
      this.leafletMapObject.panTo(this.popUp.position)
    }
  },
  mounted () {
    this.$nextTick(() => { this.leafletMapObject = this.$refs.myMap.mapObject })
    this.getData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
