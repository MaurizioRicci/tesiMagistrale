import { loadRuolo, loadTipoData, loadFunc } from '@/assets/js/loadDict'

export default {
  data () {
    return {
      // opzioni per VueTables2
      options: {
        filterable: [
          'id',
          'status',
          'denominazione',
          'denominazioner',
          'data_ante',
          'data_poste',
          'tipodata',
          'funzione',
          'id_bene',
          'ruolo',
          'id_bener',
          'ruolor',
          'bibliografia',
          'note',
          'schedatori_iniziali'
        ],
        headings: {
          data_ante: 'DataDa',
          data_poste: 'DataA',
          denominazioner: 'DenominazioneR',
          id_bener: 'Id beneR',
          ruolor: 'RuoloR',
          schedatori_iniziali: 'Sched.'
        },
        columnsDropdown: true,
        columnsDisplay: {
          id: 'mobileP',
          schedatori_iniziali: 'mobileP'
        },
        listColumns: {
          status: [
            { id: 0, text: 'In revisione' },
            { id: 1, text: 'Da rivedere' },
            { id: 2, text: 'Pronto per invio' },
            { id: 3, text: 'Bozza' }
          ],
          tipodata: [],
          ruolo: [],
          ruolor: [],
          funzione: []
        },
        perPage: 30,
        perPageValues: [],
        texts: {
          filterBy: 'Filtra',
          defaultOption: 'Scegli',
          columns: 'Colonne',
          limit: 'Risultati per pagina',
          noResults: 'Nessun risultato',
          count: 'Mostro le funzioni da {from} a {to}, {count} funzioni totali|{count} funzioni|Una funzione presente'
        }
      }
    }
  },
  methods: {
    getRuolo: function () {
      return loadRuolo(this)
        .then(resp => resp.data.map(el => { return { id: el.id, text: el.value } }))
    },
    getTipoData: function () {
      return loadTipoData(this)
        .then(resp => resp.data.map(el => { return { id: el.id, text: el.value } }))
    },
    getFunc: function () {
      return loadFunc(this)
        .then(resp => resp.data.map(el => { return { id: el.id, text: el.value } }))
    }
  },
  mounted () {
    this.getRuolo().then(arr => {
      this.options.listColumns.ruolo = arr
      this.options.listColumns.ruolor = arr
    })
    this.getTipoData().then(arr => { this.options.listColumns.tipodata = arr })
    this.getFunc().then(arr => { this.options.listColumns.funzione = arr })
  }
}
