<template>
    <LWMSTileLayer v-bind="$props" @click="getFeatureInfo" ref="myLayer">
    </LWMSTileLayer>
</template>

<script>

// codice riadattato da https://gist.github.com/rclark/6908938
import { LWMSTileLayer } from 'vue2-leaflet'
const axios = require('axios')

export default {
  name: 'BetterWMS',
  components: { LWMSTileLayer },
  data () {
    return {
      leafletObject: null
    }
  },
  props: {
    baseUrl: {type: String, required: true},
    styles: {type: String, default: ''},
    transparent: {type: Boolean, default: true},
    version: String,
    format: {typr: String, default: 'image/png'},
    attribution: {type: String, default: ''},
    layers: {type: String, default: 'benigeo'},
    name: {type: String, default: 'benigeo'},
    layerType: {type: String, default: 'base'}
  },
  methods: {
    getFeatureInfo: function (evt) {
      // Make an AJAX request to the server and hope for the best
      let url = this.getFeatureInfoUrl(evt.latlng)
      axios.get(url).then(resp => {
        let err = typeof resp === 'string' ? null : resp.data
        this.emitResults({latlng: evt.latlng, data: err})
      }, fail => { console.log(fail) })
    },
    getFeatureInfoUrl: function (latlng) {
    // Construct a GetFeatureInfo request URL given a point
      let point = this.leafletObject._map.latLngToContainerPoint(
        latlng, this.leafletObject._map.getZoom())
      let size = this.leafletObject._map.getSize()
      const L = window.L
      let params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:4326',
        styles: this.styles,
        transparent: this.transparent,
        version: this.version,
        format: this.format,
        bbox: this.leafletObject._map.getBounds().toBBoxString(),
        height: size.y,
        width: size.x,
        layers: this.layers,
        query_layers: this.layers,
        info_format: 'text/html'
      }

      params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x)
      params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y)

      return 'https://cors-anywhere.herokuapp.com/' +
        this.baseUrl + L.Util.getParamString(params, this.baseUrl, true)
    },
    emitResults (res) {
      this.$emit('getFeatureInfo', res)
    }
  },
  mounted () {
    this.$nextTick(() => { this.leafletObject = this.$refs.myLayer.mapObject })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
