<!-- Una mappa che mostra un poligono, l'utente può essere abilitato o meno alla modifica di tale poligono con
la proprietà locked; se presente disabilita la modifica -->
<template>
      <l-map :zoom="zoom" :center="center" @click="mapClick"
        v-bind:style="{ width, height, cursor }" ref="myMap">
      <!-- Controlla quali layer vedere -->
      <l-control-layers position="topright"  ></l-control-layers>

      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

        <!-- Mappa beni definitivi -->
       <BetterWMS base-url="http://quegis.labcd.unipi.it/cgi-bin/qgis_mapserv.fcgi"
        :attribution="attribution" ref="betterWMS" name="Beni approvati"
        @getFeatureInfo="evt => openPopUp(evt.latlng, evt.data)"/>

      <!-- Mappa bene temporanei utente -->
      <BetterWMS base-url="http://quegis.labcd.unipi.it/cgi-bin/qgis_mapserv.fcgi"
        layers="benigeo" :URLParams="paramsTmpLayer" layer-type="overlay"
        :attribution="attribution" ref="betterWMS2" name="Beni temporanei"
        @getFeatureInfo="evt => openPopUp(evt.latlng, evt.data)"/>

      <l-control position="bottomleft">
        <b-button-group>
          <b-button v-if="controls.watch" :pressed.sync="state.watch" key="watch">
            <IconMsg icon_name="info-circle" icon_color="white"
              icon_msg="Mostra dettagli dei beni"/>
          </b-button>
          <b-button key="zoomToPoly" v-if="polygon" @click="() => zoomToPolygon()">
            <IconMsg icon_name="search-location" icon_color="white"
              icon_msg="Zoom alla geometria"/>
          </b-button>
          <b-button to="/options/map" v-if="controls.settings" key="settings">
            <IconMsg icon_name="cog" icon_color="white"
              icon_msg="Impostazioni"/>
          </b-button>
        </b-button-group>
      </l-control>

    </l-map>
</template>

<script>
// Leaflet nonostante usi EPSG3857 accetta anche punti in 4326 facendo la conversione automatica
import { LMap, LTileLayer, LControl, LControlLayers } from 'vue2-leaflet'
import { Polygon } from '@/assets/js/Models/multiPolygonModel'
import BetterWMS from '@/components/ui/BetterWMS'
import IconMsg from '@/components/ui/IconMsg'
import LeafletToolbar from '@/assets/js/AddLeafletToolbar'
import 'leaflet-fullscreen'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LControl,
    BetterWMS,
    IconMsg,
    LControlLayers
  },
  model: {
    // imposto v-model collegato alla proprietà polygon
    prop: 'polygon',
    event: 'change'
  },
  props: {
    // default map center su Pisa. Non sembra essere reactive center in vue-leaflet
    // meglio essere sicuri del centro e poi instanziare questo componente
    center: {
      type: [Array, Object],
      default: function () {
        return this.$store.getters.getDefaultMapCenter
      }
    },
    controls: {
      type: Object,
      default: function () {
        return {
          // fullScreen, impostazioni mappa, vedi dettagli altri beni
          zoom: true, settings: true, watch: true
        }
      }
    },
    zoom: { type: Number, default: 15 },
    width: { default: '100%' },
    height: { default: '500px' },
    // vero se l'utente non può modificare il poligono
    locked: { type: Boolean },
    polygon: { type: Polygon },
    polygon_color: { type: String, default: 'green' }
  },
  methods: {
    mapClick (evt) {
      // se l'utente sta guarndando (ottiene info sui beni)
      // mostro i dettagli di dove clicca
      if (this.state.watch) {
        this.$refs.betterWMS.getFeatureInfo(evt)
      }
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
      L.popup({ maxWidth: '200', maxHeight: Number(this.height) * 0.8 })
        .setLatLng(latlng)
        .setContent(content)
        .openOn(this.leafletMapObject)
    },
    addScale (map) {
      // aggiungo la scala alla mappa
      const L = window.L
      L.control.scale({
        imperial: false,
        position: 'bottomright'
      }).addTo(map)
    },
    addFullScreen (map) {
      if (this.controls.zoom) {
        const L = window.L
        map.addControl(new L.Control.Fullscreen({
          title: {
            'false': 'Vedi a schermo intero',
            'true': 'Esci da schermo intero'
          }
        }))
      }
    },
    addPolygonToToolbar () {
      this.invalidateSize()
      LeafletToolbar.addPoly(this.toolbarStore, this.currPolygon)
    },
    zoomToPolygon (polygon = this.currPolygon) {
      const L = window.L
      if (polygon && polygon.countVertex() > 0) {
        let poly = L.polygon(polygon.getLatLngs())
        let lalo = poly.getBounds().getCenter()
        if (this.leafletMapObject) { this.leafletMapObject.setView(lalo) }
      }
    }
  },
  data () {
    return {
      leafletMapObject: null,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      state: { mappaIngrandita: false, watch: false },
      // serve poi se l'utente vuole modificarlo
      currPolygon: this.polygon ? this.polygon.clone() : new Polygon(),
      // serve al leaflet toolbar per salvare dentro il suo stato
      toolbarStore: {},
      paramsTmpLayer: { filter: 'benigeo:"id" = 1' }
    }
  },
  computed: {
    cursor () {
      return this.state.watch ? 'help' : 'crosshair'
    }
  },
  watch: {
    polygon: {
      deep: true,
      handler (polygon) {
        this.currPolygon = polygon.clone()
        this.addPolygonToToolbar()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.leafletMapObject = this.$refs.myMap.mapObject
      this.addFullScreen(this.leafletMapObject)
      this.addScale(this.leafletMapObject)
      // creo le callback per la toolbar di leaflet
      let callbacks = {
        onCreated: geoJSON => {
          // inverto le coordinate perchè in geoJSON sono lon-lat
          this.$set(this, 'currPolygon',
            new Polygon(geoJSON.geometry.coordinates[0])
              .flipCoordinates())
          this.$emit('change', this.currPolygon)
        },
        onEdited: geoJSON => {
          // inverto le coordinate perchè in geoJSON sono lon-lat
          this.$set(this, 'currPolygon',
            new Polygon(geoJSON.geometry.coordinates[0])
              .flipCoordinates())
          this.$emit('change', this.currPolygon)
        },
        onDeleted: () => {
          this.$set(this, 'currPolygon', this.currPolygon.reset())
          this.$emit('resetGeo')
          this.$emit('change', this.currPolygon)
        }
      }
      // instanzio la toolbar di leaflet
      LeafletToolbar.initToolbar(this.toolbarStore, this.leafletMapObject, callbacks, this.locked)
      this.invalidateSize()
      LeafletToolbar.addPoly(this.toolbarStore, this.currPolygon)
      this.addPolygonToToolbar()
    })
  },
  updated () {
    this.invalidateSize()
  }
}
</script>

<style>
.leaflet-editing-icon {
  width: 12px !important;
  height: 12px !important;
  margin-left: -7px !important;
  margin-top: -7px !important;
  border-radius: 5px;
}
</style>
