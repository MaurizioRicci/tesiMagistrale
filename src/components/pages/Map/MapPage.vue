<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" v-if="!noMenu"><Menu/></b-col>
      <b-col>
        <h2 v-if="!noTitle">{{title || 'Home page'}}</h2>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="6 mb-3">
        <b-form-group for="input-id-bene"
        label-cols-sm="6" class="col-6"
        label="Inserisci ID del bene DEFINITIVO">
          <b-form-input id="input-id-bene" type="number"
          @change="id => fetchBeneDataByID(id)"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="12">
        <MyMap v-if="mapCenter" :zoom="17" height="700px"
          :center="mapCenter" locked
          v-model="form.polygon"></MyMap>
      </b-col>
      <b-col cols="6" v-if="form.polygon.countVertex()">
        <b-list-group>
          <p class="m-auto">Punti scelti</p>
          <b-list-group-item v-for="(point, index) in form.polygon.getLatLngs()"
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
import commonPageMixin from '@/components/mixins/CommonPage'
import Menu from '@/components/ui/Menu'
import MyMap from '@/components/ui/Map'
import dettagliBeneMixin from '@/components/mixins/DettagliBene'

export default {
  name: 'MapPage',
  components: { Menu, MyMap },
  props: {
    id: String
  },
  mixins: [commonPageMixin, dettagliBeneMixin],
  methods: {},
  created () {
    this.fetchBeneDataByID(this.id)
  },
  watch: {
    $route (to, from) {
      this.fetchBeneDataByID(this.id)
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
