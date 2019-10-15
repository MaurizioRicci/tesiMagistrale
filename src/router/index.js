import Vue from 'vue'
import Router from 'vue-router'
import Error404 from '@/components/pages/Errors/Error404'
import MasterPage from '@/components/pages/Master/MasterPage'
import LoginPage from '@/components/pages/Login/LoginPage'
import Bene from '@/components/pages/Bene/AddEditBene'
import ViewBene from '@/components/pages/Bene/ViewBene'
import MyMap from '@/components/pages/Map/MapPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: {
        name: 'PageLogin',
        components: { MasterPage, LoginPage },
        template: '<MasterPage><LoginPage/></MasterPage>'
      }
    },
    {
      path: '/bene',
      name: 'bene',
      component: {
        name: 'PageBene',
        components: { MasterPage, Bene },
        template: '<MasterPage><Bene/></MasterPage>'
      }
    },
    {
      path: '/dettagli_bene/:id',
      name: 'DettagliBene',
      component: {
        name: 'PageVediBene',
        props: {id: String},
        components: { MasterPage, ViewBene },
        template: '<MasterPage><ViewBene :id="id"/></MasterPage>'
      },
      props: true
    },
    {
      path: '/mappa/:id',
      name: 'mappa',
      component: {
        name: 'PageMap',
        props: {id: String},
        components: { MasterPage, MyMap },
        template: '<MasterPage><MyMap :id="id"/></MasterPage>'
      },
      props: true
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: Error404
    }
  ]
})
