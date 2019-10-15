<template>
  <b-container>
      <b-row>
        <b-col>
          <h2>Visualizza bene</h2>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col cols="8">
          <b-form :novalidate="true" ref="form_bene">
            <b-form-group id="input-group-1" label="ID:"
            label-for="input-id" label-cols-sm="6" label-cols-md="2">
              <b-form-input
                    id="input-id"
                    type="text"
                    v-model="form.id"
                    disabled
                    placeholder=""
                    autocomplete="off"
                  ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Identificazione:"
            label-for="input-identificazione" label-cols-sm="6" label-cols-md="2">
              <b-form-input
                    id="input-identificazione"
                    type="text"
                    v-model="form.identificazione"
                    disabled
                    placeholder=""
                    autocomplete="off"
                  ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Descrizione:"
              label-for="input-descrizione" label-cols-sm="6" label-cols-md="2">
                <b-form-input
                id="input-descrizione"
                type="text"
                v-model="form.descrizione"
                disabled
                placeholder=""
                autocomplete="off"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="MacroEpocaOrig:"
              label-for="input-macro-epoca-orig" label-cols-sm="6" label-cols-md="2">
                  <b-form-input
                    id="input-macro-epoca-orig"
                    type="text"
                    v-model="form.macroEpocaOrig"
                    disabled
                    placeholder=""
                    autocomplete="off"
                  ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="MacroEpocaCar:"
              label-for="input-macro-epoca-car" label-cols-sm="6" label-cols-md="2">
                  <b-form-input
                    id="input-macro-epoca-car"
                    type="text"
                    v-model="form.macroEpocaCar"
                    disabled
                    placeholder=""
                    autocomplete="off"
                  ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Toponimo:" label-for="input-toponimo" label-cols-sm="6" label-cols-md="2">
              <b-form-input id="input-toponimo" v-model="form.toponimo"
                type="text" disabled placeholder=""></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Esistenza:" label-for="input-esistenza" label-cols-sm="6" label-cols-md="2">
              <b-form-input id="input-esistenza" v-model="form.esistenza" type="text" disabled placeholder=""></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Comune:" label-for="input-comune" label-cols-sm="6" label-cols-md="2">
              <b-form-input id="input-comune" v-model="form.comune" type="text" disabled placeholder=""></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Bibliografia:" label-for="input-bibliografia" label-cols-sm="6" label-cols-md="2">
              <b-form-textarea
                id="input-bibliografia"
                v-model="form.bibliografia"
                type="text"
                disabled
                placeholder=""></b-form-textarea>
            </b-form-group>
            <b-form-group id="input-group-1" label="Schedatore:" label-for="input-schedatore" label-cols-sm="6" label-cols-md="2">
              <b-form-textarea
                id="input-schedatore"
                v-model="form.schedatore"
                type="text"
                disabled
                placeholder=""></b-form-textarea>
            </b-form-group>
            <b-form-group id="input-group-1" label="Note:" label-for="input-note" label-cols-sm="6" label-cols-md="2">
              <b-form-textarea disabled id="input-note" v-model="form.note" type="text" placeholder=""></b-form-textarea>
            </b-form-group>
            <b-form-group id="input-group-1" label="Geometria:" label-for="input-geometria" label-cols-sm="6" label-cols-md="2">
              <b-form-textarea disabled id="input-geometria" v-model="polygonStr" type="text" placeholder=""></b-form-textarea>
            </b-form-group>
          </b-form>
        </b-col>
        <b-col cols="4">
          <MyMap locked v-if="mapCenter" v-model="form.polygon"
           :center="mapCenter" :zoom="17"/>
        </b-col>
      </b-row>
  </b-container>
</template>

<script>
import MyMap from '@/components/ui/Map'
import {Polygon, MultiPolygon} from '@/assets/js/multiPolygonModel'
const axios = require('axios')

export default {
  name: 'VisualizzaBene',
  components: { MyMap },
  data () {
    return {
      form: this.getModel(),
      mapCenter: null
    }
  },
  computed: {
    polygonStr: function () { return this.form.polygon.toString() }
  },
  props: {
    id: String
  },
  methods: {
    getModel () {
      return {
        id: '',
        identificazione: '',
        descrizione: '',
        macroEpocaOrig: '',
        macroEpocaCar: '',
        toponimo: '',
        esitenza: '',
        comune: '',
        bibliografia: '',
        schedatore: '',
        note: '',
        polygon: new Polygon()
      }
    },
    fetchData () {
      this.form = this.getModel()
      const T = this
      // fare richiesta dati del bene con id nella url
      axios.get(this.$store.getters.dettagliBeneURL, {
        params: { 'id': this.id }
      }).then(ok => {
        if (ok.data.length <= 0) {
          this.$vueEventBus.$emit('master-page-show-error', ['Info', 'No result found'])
        } else {
          T.form = ok.data[0]
          let geojson = ok.data[0].geojson
          T.form.polygon = new MultiPolygon()
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
<style scoped></style>
