import cloneDeep from 'lodash.clonedeep'

const STORAGE_NAME = 'options'
// opzioni di default
const DEFAULT_OPTIONS = {
  defaultMapCenter: [43.717039, 10.397445]
}
// salva nel local storage, i dati rimangono in memoria per circa 6 mesi
const saveToLocalStorage = (obj) =>
  localStorage.setItem(STORAGE_NAME, JSON.stringify(obj), 31 * 6)

let options
let optionsStr = localStorage.getItem(STORAGE_NAME)

if (optionsStr) {
  options = JSON.parse(optionsStr)
}

const optionsStore = {
  state: options || cloneDeep(DEFAULT_OPTIONS),
  getters: {
    getWholeOptions: state => state,
    getDefaultMapCenter: state => state.defaultMapCenter
  },
  mutations: {
    // salva un elenco di opzioni. Il formato atteso è JSON.
    setOptions (state, options) {
      state = Object.assign(state, options)
      saveToLocalStorage(state)
    },
    // salva il centro della mappa
    setMapCenter (state, latLongArr) {
      state.defaultMapCenter = latLongArr
      saveToLocalStorage(state)
    }
  },
  actions: {
    asyncSaveOptions (context) {
      context.commit('saveOptions')
    }
  }
}

export default optionsStore
