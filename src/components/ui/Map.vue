<!-- Una mappa che mostra un poligono, l'utente può essere abilitato o meno alla modifica di tale poligono con
la proprietà locked; se presente disabilita la modifica -->
<template>
    <l-map :zoom="zoom" :center="center" @click="addPoint"
      @update:center="invalidateSize"
      v-bind:style="{ width, height }" ref="myMap">

      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

        <l-polygon v-if="currPolygon" @click="removePoint"
      :lat-lngs="currPolygon.getLatLngs()"
      :color="polygon_color">
      </l-polygon>

      <l-control position="bottomleft">
        <div v-if="controls.zoom">
          <b-button @click="ingrandisci" v-show="!state.mappaIngrandita">
            Ingrandisci
          </b-button>
          <b-button @click="rimpicciolisci" v-show="state.mappaIngrandita">
            Rimpicciolisci
          </b-button>
        </div>
        <b-button to="/options/map" v-if="controls.settings">
              <font-awesome-icon :icon="['fas', 'cog']" style="color:white"/>
        </b-button>
      </l-control>

    </l-map>
</template>

<script>
// Leaflet nonostante usi EPSG3857 accetta anche punti in 4326 facendo la conversione automatica
import { LMap, LTileLayer, LPolygon, LControl } from 'vue2-leaflet'
import { DomEvent } from 'leaflet' // CRS è usato nel template
import { Polygon } from '@/assets/js/Models/multiPolygonModel'

export default {
  name: 'Map',
  components: { LMap, LTileLayer, LPolygon, LControl },
  model: {
    // imposto v-model collegato alla proprietà polygon
    prop: 'polygon',
    event: 'change'
  },
  props: {
    // default map center su Pisa. Non sembra essere reactive center in vue-leaflet
    // meglio essere sicuri del centro e poi instanziare questo componente
    center: {type: Array, default: function () { return this.$store.getters.getDefaultMapCenter }},
    controls: {type: Object, default: function () { return {zoom: true, settings: true} }},
    zoom: {type: Number, default: 15},
    width: {default: '100%'},
    height: {default: '500px'},
    // vero se l'utente non può modificare il poligono
    locked: {type: Boolean},
    // distanza dal click entro la quale cercare il vertice da rimuovere
    pointRemoveThreshold: {type: Number, default: 0.001},
    polygon: {type: Polygon},
    polygon_color: {type: String, default: 'green'}
  },
  methods: {
    twoPointDist: function (x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    },
    addPoint: function (evt) {
      if (this.locked || !this.currPolygon) return
      let lat = evt.latlng.lat
      let lng = evt.latlng.lng
      this.currPolygon.addVertex(lat, lng)
      // attenzione non c'è copia non alterare i dati restituiti
      this.$emit('change', this.currPolygon)
    },
    removePoint: function (evt) {
      if (this.locked || !this.currPolygon) return
      let K = this.pointRemoveThreshold
      let latP = evt.latlng.lat
      let lngP = evt.latlng.lng
      this.currPolygon = this.currPolygon.filter(
        (currLat, currLng) =>
          this.twoPointDist(latP, lngP, currLat, currLng) > K
      )
      DomEvent.stopPropagation(evt)
      this.$emit('change', this.currPolygon)
    },
    ingrandisci: function (evt) {
      this.state.mappaIngrandita = true
      // quando si preme ingrandisci mappa
      this.$emit('ingrandisci-mappa')
    },
    rimpicciolisci: function (evt) {
      this.state.mappaIngrandita = false
      // quando si preme rimpicciolisci mappa
      this.$emit('rimpicciolisci-mappa')
    },
    // @vuese
    // chiama invalidateSize() di Leaflet
    invalidateSize: function () {
      this.leafletMapObject.invalidateSize()
    }
  },
  data () {
    return {
      leafletMapObject: null,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      state: { mappaIngrandita: false },
      // serve poi se l'utente vuole modificarlo
      currPolygon: this.polygon ? this.polygon.clone() : new Polygon()
    }
  },
  watch: {
    // se cambia la proprietà aggiorno anche la copia del dato
    polygon: {
      deep: true,
      handler (val) {
        this.currPolygon = val
        this.invalidateSize()
      }
    }
  },
  mounted () {
    this.$nextTick(() => { this.leafletMapObject = this.$refs.myMap.mapObject })
  }
}
</script>
