import {loadMacroEpocaCar, loadMacroEpocaOrig} from '@/assets/js/loadDict'

export default {
  data () {
    return {
      options: {
        filterable: [ 'id',
          'status',
          'identificazione',
          'descrizione',
          'comune',
          'macroEpocaCar',
          'macroEpocaOrig',
          'bibliografia',
          'note',
          'toponimo',
          'msg_validatore'],
        listColumns: {
          status: [
            {id: 0, text: 'In revisione'},
            {id: 1, text: 'Da rivedere'},
            {id: 2, text: 'Pronto per invio'},
            {id: 3, text: 'Bozza'}
          ],
          macroEpocaCar: [],
          macroEpocaOrig: []
        }
      }
    }
  },
  methods: {
    getMac: function () {
      return loadMacroEpocaCar(this)
        .then(resp => resp.data.map(el => { return {id: el.id, text: el.value} }))
    },
    getMeo: function () {
      return loadMacroEpocaOrig(this)
        .then(resp => resp.data.map(el => { return {id: el.id, text: el.value} }))
    }
  },
  mounted () {
    this.getMac().then(arr => { this.options.listColumns.macroEpocaCar = arr })
    this.getMeo().then(arr => { this.options.listColumns.macroEpocaOrig = arr })
  }
}
