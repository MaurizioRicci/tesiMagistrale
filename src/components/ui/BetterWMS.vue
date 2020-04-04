<template>
  <div></div>
</template>

<script>
import WMS from 'leaflet.wms'

// Crea un layer WMS basato su leaflet con il supporto a richieste di tipo
// GetFeatureInfo. Utilizza il plugin leaflet.wms
export default {
  name: 'BetterWMS',
  components: {},
  data () {
    return {}
  },
  props: {
    // mappa a cui agganciare il livello WMS
    leafletMap: { required: true },
    // vero se deve mostrare i dettagli della mapppa dopo aver fatto click
    // questa opzione è settata a false durante editing di geometria
    infoOnClick: Boolean,
    // URL dal quale recuperare il layer WMS
    baseUrl: { type: String, required: true },
    styles: { type: String, default: '' },
    transparent: { type: Boolean, default: true },
    format: { typr: String, default: 'image/png' },
    attribution: { type: String, default: '' },
    // parametri addizionali per la URL specificati dall'utente
    // il formato atteso è JSON es: { params1: 'value1', params2='value2' }
    URLParams: { type: Object, default: () => {} }
  },
  methods: {
    init () {
      if (!this.leafletMap) return
      const L = window.L
      const vueInstance = this
      var MySource = WMS.Source.extend({
        'getIdentifyLayers': function () {
          if (vueInstance.infoOnClick) {
            // Hook to determine which layers to identify
            if (this.options.identifyLayers) { return this.options.identifyLayers }
            return Object.keys(this._subLayers)
          } else return []
        },
        'onRemove': function () {}
      })
      let source = new MySource(
        'http://quegis.labcd.unipi.it/cgi-bin/qgis_mapserv.fcgi',
        {
          'format': this.format,
          'styles': this.styles,
          'transparent': this.transparent,
          'attribution': "<a href='https://www.unipi.it/'>UniPi</a>",
          'info_format': 'text/html',
          'tiled': false,
          'FEATURE_COUNT': 50,
          ...this.URLParams
        })
      let basemaps = {
        'Benigeo': source.getLayer('benigeo').addTo(this.leafletMap)
      }
      /* /
      Al momento non c'è un layer di beni temporanei. Scommentare quando ci sarà.
      let overlay = {
        'Benigeo_temp': source.getLayer('benigeo').addTo(this.leafletMap)
      }
      L.control.layers(basemaps, overlay).addTo(this.leafletMap)
      / */
      // aggiungo solo il layer dei beni definitivi
      L.control.layers(basemaps).addTo(this.leafletMap)
    }
  },
  watch: {
    leafletMap: function (newVal) {
      this.init()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
