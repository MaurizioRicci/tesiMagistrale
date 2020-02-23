import { loadMacroEpocaCar, loadMacroEpocaOrig, loadEsistenza } from '@/assets/js/loadDict'

export default {
  data () {
    return {
      options: {
        caption: 'd',
        filterable: [
          'id',
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
          'msg_validatore',
          'schedatori_iniziali'
        ],
        columnsDropdown: true,
        columnsDisplay: {
          macroEpocaCar: 'mobileP',
          macroEpocaOrig: 'mobileP',
          schedatori_iniziali: 'mobileP'
        },
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
        texts: {
          filterBy: 'Filtra',
          defaultOption: 'Scegli',
          columns: 'Colonne',
          limit: 'Risultati per pagina',
          noResults: 'Nessun risultato',
          count: 'Mostro i beni da {from} a {to}, {count} beni totali|{count} beni|Un bene presente'
        },
        perPage: 30,
        perPageValues: []
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
