import Vue from 'vue'
import Vuex from 'vuex'
import serverURLsStore from './URLsStore'
import userDataStore from './userStore'
import optionsStore from './optionsStore'
import copiaIncolla from './copiaIncolla'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    serverlURLs: serverURLsStore,
    userData: userDataStore,
    optionsStore: optionsStore,
    copiaIncolla: copiaIncolla
  }
})

/* / Se si danno delle impostazioni di default negli store (es: userStore)
occorre ricordare di fare una deep clone, si veda userStore. Altrimenti c'è
il rischio di andare a sovrascrivere le impostazioni di default. Sarà cosi impossibile
ritornare alle impostazioni di default senza un rilancio dell'app
/ */
