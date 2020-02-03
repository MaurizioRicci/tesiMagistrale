import { loadMacroEpocaCar, loadMacroEpocaOrig, loadEsistenza } from '@/assets/js/loadDict'

export default {
  data () {
    return {
      options: {
        filterable: [ 'id',
          'status',
          'identificazione',
          'descrizione',
          'comune',
          'esistenza',
          'macroEpocaCar',
          'macroEpocaOrig',
          'bibliografia',
          'note',
          'toponimo',
          'msg_validatore'],
        listColumns: {
          status: [
            { id: 0, text: 'In revisione' },
            { id: 1, text: 'Da rivedere' },
            { id: 2, text: 'Pronto per invio' },
            { id: 3, text: 'Bozza' }
          ],
          macroEpocaCar: [],
          macroEpocaOrig: [],
          esistenza: []
        },
        texts: { limit: 'Risultati per pagina', noResults: 'Nessun risultato' }
      }
    }
  },
  methods: {
    getMac: function () {
      return loadMacroEpocaCar(this)
        .then(resp => resp.data.map(el => { return { id: el.id, text: el.value } }))
    },
    getMeo: function () {
      return loadMacroEpocaOrig(this)
        .then(resp => resp.data.map(el => { return { id: el.id, text: el.value } }))
    },
    getEsistenza: function () {
      return loadEsistenza(this)
        .then(resp => resp.data.map(el => { return { id: el.id, text: el.value } }))
    }
  },
  mounted () {
    // inizializzo le select
    this.getMac().then(arr => { this.options.listColumns.macroEpocaCar = arr })
    this.getMeo().then(arr => { this.options.listColumns.macroEpocaOrig = arr })
    this.getEsistenza().then(arr => { this.options.listColumns.esistenza = arr })
  }
}
