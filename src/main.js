// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// BootstrapVue
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Vuex store del progetto
import { store } from './store/store'

// Icone FontAwesome
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

// Axios
import Axios from 'axios'
import { successHandlerResponse, errorHandlerResponse } from '@/assets/js/axiosInterceptors'

// Leaflet
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// vue-tables-2
import {ClientTable, ServerTable} from 'vue-tables-2'

Vue.config.productionTip = false

Vue.use(BootstrapVue)

Vue.prototype.$vueEventBus = new Vue()

delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.use(ClientTable, {}, false, 'bootstrap4')
Vue.use(ServerTable, {}, false, 'bootstrap4')

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
