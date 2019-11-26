// eslint-disable-next-line no-unused-vars
import { getCookie, existCookie } from '@/assets/js/cookie'

let userData
if (existCookie('userData')) {
  // si passa sempre dal login lato server a ogni lancio dell'applicazione
  // userData = JSON.parse(getCookie('userData'))
}

const userDataStore = {
  state: {
    currUserData: userData || {
      username: '',
      password: '',
      role: ''
    }
  },
  getters: {
    getUserData: state => state.currUserData,
    loggedIn: state => state.currUserData.username !== '' &&
        state.currUserData.password !== ''
  },
  mutations: {
    registerUser (state, userData) {
      let {username, password, role} = userData
      state.currUserData.username = username || ''
      state.currUserData.password = password || ''
      state.currUserData.role = role || ''
    }
  }
}

export default userDataStore
