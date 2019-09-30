// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { store } from './store/store'

import Unicon from 'vue-unicons'
import { uniLock, uniExclamationOctagon } from 'vue-unicons/src/icons'
Unicon.add([uniLock, uniExclamationOctagon])

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(Unicon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
