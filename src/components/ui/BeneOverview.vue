<template>
    <div role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-1 variant="info">Mappa</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="accordion-bene-details" role="tabpanel">
          <b-card-body>
            <MyMap ref="myMap" :polygon="beneData.form.polygon"
             :center="beneData.mapCenter" locked :zoom="17"/>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle.accordion-2 variant="info">Attributi</b-button>
        </b-card-header>
        <b-collapse id="accordion-2" accordion="accordion-bene-details" role="tabpanel">
          <b-card-body>
            <BeneFormView v-if="beneData" :form="beneData.form" disallowIDChange/>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
</template>

<script>
import MyMap from '@/components/ui/Map'
import BeneFormView from '@/components/ui/BeneFormView'
import getBeneModel from '@/assets/js/Models/beneModel'
import fetchBene from '@/assets/js/fetchBene'

// Mostra i dettagli di un bene (attributi + geografia) in modo compatto
export default {
  name: 'BeneOverView',
  components: { MyMap, BeneFormView },
  props: {
    idBene: String,
    idUtente: String,
    // se vero aspetta il metodo showBeneDetails per caricare i dati, altrimenti carica appena montato
    lazyLoad: Boolean
  },
  data () {
    return {
      beneData: { form: getBeneModel(), mapCenter: this.$store.getters.getDefaultMapCenter }
    }
  },
  methods: {
    // @vuese
    // carico i dettagli del bene sapendo che id & id_utente sono stati passati
    // tramite le proprietà del componente
    showBeneDetailsProps () { return this.showBeneDetails(this.idBene, this.idUtente) },
    // @vuese
    // carico i dettagli di uno specifico bene
    showBeneDetails (idBene, idUtenteBene) {
      if (!idBene) {
        this.$vueEventBus.$emit('master-page-show-msg', ['Errore', 'Nessun ID specificato per il bene.'])
        return
      }
      let postData = {
        'id': idBene,
        'id_utente': idUtenteBene,
        'tmp_db': idUtenteBene !== ''
      }
      return fetchBene(this, postData)
        .then(data => {
          this.beneData = data
          this.$refs.myMap.invalidateSize()
        })
    }
  },
  mounted () {
    if (!this.lazyLoad) this.showBeneDetailsProps()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
