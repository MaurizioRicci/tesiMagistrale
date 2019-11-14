import Vue from 'vue'
import Router from 'vue-router'
import Error404 from '@/components/pages/Errors/Error404'
import LoginPage from '@/components/pages/Login/LoginPage'
import Bene from '@/components/pages/Bene/AddEditBene'
import ViewBene from '@/components/pages/Bene/ViewBene'
import MyMap from '@/components/pages/Map/MapPage'
import BeniAggiuntiInRevisione from '@/components/pages/Bene/BeniAggiuntiInRevisione'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'loginPage',
      component: LoginPage
    },
    {
      path: '/home',
      name: 'homePage',
      component: {
        name: 'PageHome',
        template: '<h1>Home</h1>'
      }
    },
    {
      path: '/bene',
      name: 'benePage',
      // addEditBene
      component: Bene
    },
    {
      path: '/dettagli_bene',
      component: {
        name: 'PageDettagliBene',
        template: '<router-view/>'
      },
      children: [
        {path: '',
          component: ViewBene
        },
        {path: ':id',
          component: ViewBene,
          props: true
        }
      ]
    },
    {
      path: '/mappa/:id',
      name: 'mappaPage',
      component: MyMap,
      props: true
    },
    {
      path: '/ricerca_beni',
      name: 'ricercaBeniPage',
      component: BeniAggiuntiInRevisione
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: Error404
    }
  ]
})
