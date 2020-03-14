import cloneDeep from 'lodash.clonedeep'

// nome dello storage
const STORAGE_NAME = 'userData'
const DEFAULT_USER_DATA = {
  username: '',
  password: '',
  userID: '', // non chiamarlo id_utente => già usato per altri parametri
  role: ''
}
// salva nel local storage, i dati rimangono in memoria per 14 giorni
const saveToLocalStorage = (obj) =>
  localStorage.setItem(STORAGE_NAME, JSON.stringify(obj), 14)

let userData
let userDataStr = localStorage.getItem(STORAGE_NAME)
if (userDataStr) {
  // si passa sempre dal login lato server a ogni lancio dell'applicazione
  userData = JSON.parse(userDataStr)
}

const userDataStore = {
  state: {
    currUserData: userData || cloneDeep(DEFAULT_USER_DATA)
  },
  getters: {
    getUserData: state => state.currUserData,
    loggedIn: state => state.currUserData.username.trim() !== '' &&
                          state.currUserData.password.trim() !== ''
  },
  mutations: {
    logoutUser (state, options) {
      state.currUserData = { ...cloneDeep(DEFAULT_USER_DATA) }
      saveToLocalStorage(state.currUserData)
    },
    registerUser (state, options) {
      let { username, password, role, id, rememberUser } = options
      state.currUserData.username = username || ''
      state.currUserData.password = password || ''
      state.currUserData.role = role || ''
      state.currUserData.userID = id || ''

      if (rememberUser) {
        saveToLocalStorage(state.currUserData)
      }
    }
  }
}

export default userDataStore
