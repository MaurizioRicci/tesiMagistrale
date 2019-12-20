import Vue from 'vue'
import Vuex from 'vuex'
import serverURLsStore from './URLsStore'
import userDataStore from './userStore'
import optionsStore from './optionsStore'
import infoBeni from './infoBeni'
import copiaIncolla from './copiaIncolla'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    serverlURLs: serverURLsStore,
    userData: userDataStore,
    optionsStore: optionsStore,
    infoBeni: infoBeni,
    copiaIncolla: copiaIncolla
  }
})
