<template>
  <b-container fluid>
      <b-row>
        <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
        <b-col>
          <h2 v-if="!noTitle">{{title || 'Visualizza un bene'}}</h2>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <transition name="slide-fade" v-on:leave="mapCols = 12">
        <b-col cols="8" v-show="12-mapCols > 0">
          <b-form :novalidate="true" ref="form_bene">
            <b-form-group id="input-group-1" label="ID:"
            label-for="input-id" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
              <b-form-input
                    id="input-id"
                    type="text"
                    v-model="form.id"
                    placeholder=""
                    autocomplete="off"
                    @keyup.enter="() => fetchDataByID(form.id)"
                    :disabled="this.disallowIDChange"
                  ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Identificazione:"
            label-for="input-identificazione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
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
              label-for="input-descrizione" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
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
              label-for="input-macro-epoca-orig" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
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
              label-for="input-macro-epoca-car" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
                  <b-form-input
                    id="input-macro-epoca-car"
                    type="text"
                    v-model="form.macroEpocaCar"
                    disabled
                    placeholder=""
                    autocomplete="off"
                  ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Toponimo:" label-for="input-toponimo" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
              <b-form-input id="input-toponimo" v-model="form.toponimo"
                type="text" disabled placeholder=""></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Esistenza:" label-for="input-esistenza" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
              <b-form-input id="input-esistenza" v-model="form.esistenza" type="text" disabled placeholder=""></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Comune:" label-for="input-comune" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
              <b-form-input id="input-comune" v-model="form.comune" type="text" disabled placeholder=""></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-1" label="Bibliografia:" label-for="input-bibliografia" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
              <b-form-textarea
                id="input-bibliografia"
                v-model="form.bibliografia"
                type="text"
                disabled
                placeholder=""></b-form-textarea>
            </b-form-group>
            <b-form-group id="input-group-1" label="Schedatori:" label-for="input-schedatori" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
              <b-form-textarea
                id="input-schedatori"
                v-model="form.schedatori_iniziali"
                type="text"
                disabled
                placeholder=""></b-form-textarea>
            </b-form-group>
            <b-form-group id="input-group-1" label="Note:" label-for="input-note" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
              <b-form-textarea disabled id="input-note" v-model="form.note" type="text" placeholder=""></b-form-textarea>
            </b-form-group>
            <b-form-group id="input-group-1" label="Geometria:" label-for="input-geometria" label-cols-sm="6" label-cols-md="3" label-cols-xl="2">
              <b-form-textarea disabled id="input-geometria" v-model="polygonStr" type="text" placeholder=""></b-form-textarea>
            </b-form-group>
          </b-form>
          <b-button type="submit" variant="primary" @click="goBack">Indietro</b-button>
          <!-- si modificano solo beni definitivi -->
          <b-button type="reset" variant="danger" @click="onEdit"
            v-if="!cercaInRevisione">Modifica</b-button>
        </b-col>
        </transition>
        <b-col :cols="mapCols">
          <MyMap ref="myMap" locked v-if="mapCenter" v-model="form.polygon"
           :center="mapCenter" :zoom="17" @ingrandisci-mappa="ingrandisciMappa"
           @rimpicciolisci-mappa="rimpicciolisciMappa"/>
        </b-col>
      </b-row>
  </b-container>
</template>

<script>
import Menu from '@/components/ui/Menu'
import MyMap from '@/components/ui/Map'
import pageCommonMixin from '@/components/mixins/PageCommon'
import dettagliBeneMixin from '@/components/mixins/DettagliBene'
import '@/assets/css/slideFadeTransition.css'

export default {
  name: 'VisualizzaBene',
  components: { Menu, MyMap },
  mixins: [pageCommonMixin, dettagliBeneMixin],
  data () {
    return {
      mapCols: 4
    }
  },
  computed: {
    polygonStr: function () { return this.form.polygon.toString() }
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
      this.$router.push('/bene/' + this.formRetrived.id)
    }
  },
  created () {
    this.fetchDataByID(this.id)
  },
  watch: {
    $route (to, from) {
      this.fetchDataByID(this.id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
