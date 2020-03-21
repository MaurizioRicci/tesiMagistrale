<template>
    <div class="mb-1">
        <b-button variant="outline-primary" @click="copia">
          <IconMsg icon_name="copy" icon_size="lg"
          icon_msg="Copia funzione"/>
        </b-button>
        <b-button variant="outline-primary" v-b-modal.modal-incolla
          v-if="!noPaste && copiedModels.length > 0" key="incollaBtn">
          <IconMsg icon_name="clipboard" icon_size="lg"
            icon_msg="Incolla funzione"/>
        </b-button>

        <b-modal v-if="!noPaste" id="modal-incolla" title="Incolla funzione"
          key="incollaModal" @hidden="copiedMsgVal = ''" ok-only ok-title="Chiudi">
          <b-pagination :value="lastPage" pills per-page="1"
            :total-rows="copiedModels.length" size="sm"
            hide-goto-end-buttons></b-pagination>

          <div v-for="el in buildValues" :key="el.value"
            class="row no-gutters justify-content-between">
            <label>{{text[el.value]}}</label>
            <b-badge variant="info" class="align-self-center"
              v-if="copiedMsgVal === el.value">Copiato</b-badge>
            <textarea class="col-12 px-1 form-control" title="Fai click per copiare"
              readonly="readonly" :value="el.text" rows="1"
              @click="e => copyValue(e, el)"/>
            <hr class="col-12"/>
          </div>
        </b-modal>
    </div>
</template>

<script>
import IconMsg from '@/components/ui/IconMsg'
// Mostro i bottoni per copiare/incollare una funzione
export default {
  name: 'FunzioneCopiaIncolla',
  components: { IconMsg },
  props: {
    // serve per memorizzare i dati del modello corrente se l'utente preme su copia
    funzioneModel: { type: Object, required: true },
    // se vero non si può incollare niente
    noPaste: Boolean
  },
  data () {
    return {
      selected: [],
      text: {
        'id_bene': 'ID bene',
        'id_bener': 'ID bene rif.',
        'data': 'Data',
        'data_ante': 'Data anteriore',
        'data_post': 'Data posteriore',
        'tipodata': 'Tipo data',
        'bibliografia': 'Bibliografia',
        'note': 'Note',
        'denominazione': 'Denominazione',
        'denominazioner': 'Denominazione rif.',
        'ruolo': 'Ruolo',
        'ruolor': 'Ruolo rif.'
      },
      // innesca il messaggio di avvenuta copia
      copiedMsgVal: ''
    }
  },
  computed: {
    copiedModels () { return this.$store.getters.getFunzioneCopiata },
    // indice ultima pagina. Parte da 1 come richiesto da b-pagination
    lastPage () { return this.copiedModels.length || 1 },
    buildValues () {
      if (this.copiedModels && this.lastPage > 0 &&
        this.lastPage <= this.copiedModels.length) {
        let currModel = this.copiedModels[this.lastPage - 1]
        let valuesTmp = Object.keys(currModel).map(key => {
          // trasformo le chiavi del modello in array di oggetti con chiavi text & value
          // poi lo do in pasto a bootstrap
          // es: [{text: '507', value: 'id_bene'}, ...]
          let txt = currModel[key].toString()
          if (key === 'ruolo' || key === 'ruolor') {
            txt = currModel[key].join(', ')
          }
          return { text: txt, value: key }
        })
        // sono interessato solo a alcune chiavi però
          .filter(el => Object.keys(this.text).includes(el.value))
        return valuesTmp
      } else return []
    }
  },
  methods: {
    copia () {
      this.$store.commit('copiaFunzione', this.funzioneModel)
    },
    copyValue (event, el) {
      let txtArea = event.currentTarget
      /* Select the text field */
      txtArea.select()
      txtArea.setSelectionRange(0, 99999) /* For mobile devices */
      /* Copy the text inside the text field */
      document.execCommand('copy')
      /* Alert the copied text */
      this.copiedMsgVal = el.value
    }
  },
  mounted () {}
}
</script>

<style scoped>
 textarea {
   cursor: pointer;
 }
</style>
