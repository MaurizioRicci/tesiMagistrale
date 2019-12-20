<template>
    <div class="mb-1">
        <b-button variant="outline-primary" @click="copia">
          <IconMsg icon_name="copy" icon_size="lg"
          icon_msg="Copia funzione"/>
        </b-button>
        <b-button variant="outline-primary" v-b-modal.modal-incolla
          v-if="!noPaste && copiedModel" key="incollaBtn">
          <IconMsg icon_name="clipboard" icon_size="lg"
            icon_msg="Incolla funzione"/>
        </b-button>

        <b-modal v-if="!noPaste" id="modal-incolla" title="Incolla funzione"
          @ok="incolla" key="incollaModal">
          <div v-for="chk in buildChks" :key="chk.value">
            <div>
              <b-form-checkbox inline
              :options="chk" v-model="selected" :value="chk.value">
                <p>{{text[chk.value]}}</p>
              </b-form-checkbox>
            </div>
            <div>
              {{chk.text}}
            </div>
            <hr/>
          </div>
        </b-modal>
    </div>
</template>

<script>
import IconMsg from '@/components/ui/IconMsg'
// Mostro i bottoni per copiare/incollare una funzione
export default {
  name: 'FunzioneCopiaIncolla',
  components: {IconMsg},
  props: {
    funzioneModel: {type: Object, required: true},
    noPaste: Boolean},
  data () {
    return {
      selected: [],
      text: {
        'id_bene': 'ID bene',
        'id_bener': 'ID bene rif.',
        'data': 'Data',
        'data_ante': 'Data anteriore',
        'data_poste': 'Data posteriore',
        'tipodata': 'Tipo data',
        'bibliografia': 'Bibliografia',
        'note': 'Note',
        'denominazione': 'Denominazione',
        'denominazioner': 'Denominazione rif.',
        'ruolo': 'Ruolo',
        'ruolor': 'Ruolo rif.'
      }
    }
  },
  computed: {
    copiedModel () { return this.$store.getters.getFunzioneCopiata },
    buildChks () {
      if (this.copiedModel) {
        let chksTmp = Object.keys(this.copiedModel).map(key => {
          // trasformo le chiavi del modello in array di oggetti con chiavi text & value
          // poi lo do in pasto a bootstrap
          // es: [{text: '507', value: 'id_bene'}, ...]
          let txt = this.copiedModel[key].toString()
          if (key === 'ruolo' || key === 'ruolor') {
            txt = this.copiedModel[key].join(', ')
          }
          return {text: txt, value: key}
        })
        // sono interessato solo a alcune chiavi però
          .filter(el => Object.keys(this.text).includes(el.value))
        return chksTmp
      }
    }
  },
  methods: {
    copia () {
      this.$store.commit('copiaFunzione', this.funzioneModel)
    },
    incolla () {
      let info = Object.keys(this.copiedModel)
      // filtro solo i selezionati
        .filter(key => this.selected.includes(key))
        // alla fine rendo un oggetto
        .reduce((obj, key) => {
          obj[key] = this.copiedModel[key]
          return obj
        }, {})
      this.$emit('incolla_funzione', info)
    }
  },
  mounted () {

  }
}
</script>
