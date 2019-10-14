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
import Axios from 'axios'
import { successHandlerResponse, errorHandlerResponse } from '@/assets/js/axiosInterceptors'

import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

Unicon.add([uniLock, uniExclamationOctagon])

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(Unicon)

Vue.prototype.$vueEventBus = new Vue()

delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

/* eslint-disable no-new */
const myApp = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

Axios.interceptors.response.use(
  response => successHandlerResponse(response, myApp),
  error => errorHandlerResponse(error, myApp)
)
