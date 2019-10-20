const userDataStore = {
  state: {
    currUserData: {
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
