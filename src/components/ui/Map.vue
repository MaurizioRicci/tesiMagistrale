<!-- Una mappa che mostra un poligono, l'utente può essere abilitato o meno alla modifica di tale poligono con
la proprietà locked; se presente disabilita la modifica -->
<template>
      <l-map :zoom="zoom" :center="center"
        v-bind:style="{ width, height, cursor }" ref="myMap">

      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <v-geosearch :options="geosearchOptions" ></v-geosearch>

        <!-- Mappa beni -->
       <BetterWMS :base-url="$store.getters.mapServerURL"
        ref="betterWMS" :leafletMap="leafletMapObject" :infoOnClick="state.watch"
        :styles="style" :URLParamssss="paramsTmpLayer"/>

      <l-control position="bottomleft">
        <b-button-group>
          <b-button :pressed.sync="state.toggle_label" key="toggle_label">
            <IconMsg icon_name="remove-format" icon_color="white"
              icon_msg="Attiva/Disattiva etichette elementi"/>
          </b-button>
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
import { LMap, LTileLayer, LControl } from 'vue2-leaflet'
import { Polygon } from '@/assets/js/Models/multiPolygonModel'
import BetterWMS from '@/components/ui/BetterWMS'
import IconMsg from '@/components/ui/IconMsg'
import LeafletToolbar from '@/assets/js/AddLeafletToolbar'
import 'leaflet-fullscreen'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import VGeosearch from 'vue2-leaflet-geosearch'
import 'leaflet-geosearch/dist/style.css'
import 'leaflet-geosearch/assets//css/leaflet.css'
export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LControl,
    BetterWMS,
    IconMsg,
    VGeosearch
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
    // @vuese
    // chiama invalidateSize() di Leaflet
    invalidateSize: function () {
      this.leafletMapObject &&
        this.leafletMapObject.invalidateSize()
    },
    openPopUp (latlng, content) {
      const L = window.L
      L.popup({ maxHeight: Number(this.height) * 0.8 })
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
      // salvano lo stato della mappa: es: la mappa è fullscreen?
      // Stiamo richiedendo info per gli elementi sulla mappa?
      // abbiamo rimosso le etichette dalla mappa?
      state: { mappaIngrandita: false, watch: false, toggle_label: false },
      // serve poi se l'utente vuole modificarlo
      currPolygon: this.polygon ? this.polygon.clone() : new Polygon(),
      // serve al leaflet toolbar per salvare dentro il suo stato
      toolbarStore: {},
      paramsTmpLayer: { filter: 'benigeo:"id" = 1' },
      // opzioni per leaflet geosearch
      geosearchOptions: { // Important part Here
        provider: new OpenStreetMapProvider(),
        style: 'button',
        autoClose: true,
        keepResult: true,
        autoComplete: true, // optional: true|false  - default true
        autoCompleteDelay: 250,
        searchLabel: 'Cerca indirizzo'
      }
    }
  },
  computed: {
    cursor () {
      return this.state.watch ? 'help' : 'crosshair'
    },
    // style per la mappa, Può assumere valori: stringa vuota (default), no_label (senza etichette)
    style () { return this.state.toggle_label ? 'no_label' : '' }
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
.leaflet-control-geosearch.active form {
  max-width: 300px;
}
</style>

<style scoped>
.btn-secondary:not(:disabled):not(.disabled).active{
  background-color: #518bb5;
}
</style>
