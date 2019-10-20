import Vue from 'vue'
import Vuex from 'vuex'
import serverURLsStore from './URLsStore'
import userDataStore from './userStore'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    serverlURLs: serverURLsStore,
    userData: userDataStore
  }
})
