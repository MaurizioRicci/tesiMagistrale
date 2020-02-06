// eslint-disable-next-line no-unused-vars
import { getCookie, existCookie } from '@/assets/js/cookie'

let userData
if (existCookie('userData')) {
  // si passa sempre dal login lato server a ogni lancio dell'applicazione
  userData = JSON.parse(getCookie('userData'))
}

const userDataStore = {
  state: {
    currUserData: userData || {
      username: '',
      password: '',
      userID: '', // non chiamarlo id_utente => già usato per altri parametri
      role: ''
    }
  },
  getters: {
    getUserData: state => state.currUserData,
    loggedIn: state => state.currUserData.id !== ''
  },
  mutations: {
    registerUser (state, userData) {
      let { username, password, role, id } = userData
      state.currUserData.username = username || ''
      state.currUserData.password = password || ''
      state.currUserData.role = role || ''
      state.currUserData.userID = id || ''
    }
  }
}

export default userDataStore
