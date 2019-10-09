import Vue from 'vue'
import Router from 'vue-router'
import Error404 from '@/components/pages/Errors/Error404'
import MasterPage from '@/components/pages/Master/MasterPage'
import LoginPage from '@/components/pages/Login/LoginPage'
import Bene from '@/components/pages/Bene/AddEditBene'
import ViewBene from '@/components/pages/Bene/ViewBene'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: LoginPage
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
        components: { MasterPage, ViewBene },
        template: '<MasterPage><ViewBene/></MasterPage>'
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
