<!-- Una mappa che mostra un poligono, l'utente può essere abilitato o meno alla modifica di tale poligono con
la proprietà locked; se presente disabilita la modifica -->
<template>
    <l-map :zoom="zoom" :center="center" @click="mapClick"
      @update:center="invalidateSize"
      v-bind:style="{ width, height }" ref="myMap">

      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

      <BetterWMS base-url="http://quegis.labcd.unipi.it/cgi-bin/qgis_mapserv.fcgi"
        :attribution="attribution" ref="betterWMS"
        @getFeatureInfo="evt => openPopUp(evt.latlng, evt.data)"/>

        <l-polygon v-if="currPolygon" @click="removePoint"
      :lat-lngs="currPolygon.getLatLngs()"
      :color="polygon_color">
      </l-polygon>

      <l-control position="bottomleft">
        <b-button-group>
          <span v-if="controls.zoom">
            <b-button @click="ingrandisci" v-show="!state.mappaIngrandita">
              Ingrandisci
            </b-button>
            <b-button @click="rimpicciolisci" v-show="state.mappaIngrandita">
              Rimpicciolisci
            </b-button>
          </span>
          <b-button v-if="controls.watch" :pressed.sync="watch">
            <IconMsg icon_name="info-circle" icon_color="white"
              icon_msg="Mostra dettagli dei beni"/>
          </b-button>
          <b-button to="/options/map" v-if="controls.settings">
            <font-awesome-icon :icon="['fas', 'cog']" style="color:white"/>
          </b-button>
        </b-button-group>
      </l-control>

    </l-map>
</template>

<script>
// Leaflet nonostante usi EPSG3857 accetta anche punti in 4326 facendo la conversione automatica
import { LMap, LTileLayer, LPolygon, LControl } from 'vue2-leaflet'
import { DomEvent } from 'leaflet' // CRS è usato nel template
import { Polygon } from '@/assets/js/Models/multiPolygonModel'
import BetterWMS from '@/components/ui/BetterWMS'
import IconMsg from '@/components/ui/IconMsg'

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LPolygon,
    LControl,
    BetterWMS,
    IconMsg },
  model: {
    // imposto v-model collegato alla proprietà polygon
    prop: 'polygon',
    event: 'change'
  },
  props: {
    // default map center su Pisa. Non sembra essere reactive center in vue-leaflet
    // meglio essere sicuri del centro e poi instanziare questo componente
    center: {type: Array, default: function () { return this.$store.getters.getDefaultMapCenter }},
    controls: {type: Object,
      default: function () {
        return {
          zoom: true, settings: true, watch: true
        }
      }},
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
    mapClick (evt) {
      // se l'utente sta guarndando (ottiene info sui beni)
      // mostro i dettagli di dove clicca
      if (this.watch) {
        this.$refs.betterWMS.getFeatureInfo(evt)
      } else {
        // se l'utente non sta guardando i dettagli allora
        // provo a vedere se può modificare il poligono del bene
        this.addPoint(evt)
      }
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
      this.leafletMapObject &&
        this.leafletMapObject.invalidateSize()
    },
    openPopUp (latlng, content) {
      const L = window.L
      L.popup({maxWidth: '200', maxHeight: Number(this.height) * 0.8})
        .setLatLng(latlng)
        .setContent(content)
        .openOn(this.leafletMapObject)
    }
  },
  data () {
    return {
      leafletMapObject: null,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      state: { mappaIngrandita: false },
      // serve poi se l'utente vuole modificarlo
      currPolygon: this.polygon ? this.polygon.clone() : new Polygon(),
      watch: this.controls.watch
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
