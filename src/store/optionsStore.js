// import { getCookie, existCookie, setCookie } from '@/assets/js/cookie'
const STORAGE_NAME = 'options'

const DEFAULT_OPTIONS = {
  defaultMapCenter: [43.717039, 10.397445]
}
const saveToLocalStorage = (obj) =>
  localStorage.setItem(STORAGE_NAME, JSON.stringify(obj), 31 * 6)

let options
// if (existCookie('options')) {
if (localStorage.getItem(STORAGE_NAME)) {
  options = JSON.parse(localStorage.getItem(STORAGE_NAME))
}

const optionsStore = {
  state: options || DEFAULT_OPTIONS,
  getters: {
    getWholeOptions: state => state,
    getDefaultMapCenter: state => state.defaultMapCenter
  },
  mutations: {
    setOptions (state, options) {
      state = Object.assign(state, options)
      saveToLocalStorage(state)
    },
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
