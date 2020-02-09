// import { getCookie, existCookie, setCookie } from '@/assets/js/cookie'
const STORAGE_NAME = 'options'
let options

const saveToLocalStorage = (obj) =>
  localStorage.setItem(STORAGE_NAME, JSON.stringify(obj), 31 * 6)

// if (existCookie('options')) {
if (localStorage.getItem(STORAGE_NAME)) {
  options = JSON.parse(localStorage.getItem(STORAGE_NAME))
}

const optionsStore = {
  state: options || {
    defaultMapCenter: [43.717039, 10.397445]
  },
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
      saveToLocalStorage(state.defaultMapCenter)
    }
  },
  actions: {
    asyncSaveOptions (context) {
      context.commit('saveOptions')
    }
  }
}

export default optionsStore
