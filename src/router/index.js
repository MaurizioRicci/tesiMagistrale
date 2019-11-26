import Vue from 'vue'
import Router from 'vue-router'
import {store} from '@/store/store'
const Error404 = () => import('@/components/pages/Errors/Error404')
const Login = () => import('@/components/pages/Login/Login')
const Home = () => import('@/components/pages/Home/Home')
const Bene = () => import('@/components/pages/Bene/AddEditBene')
const ViewBene = () => import('@/components/pages/Bene/ViewBene')
const RicercaBeniApprovati = () => import('@/components/pages/Bene/BeniRicercaApprovati')
const MyMap = () => import('@/components/pages/Map/MapPage')
const MyMapOptions = () => import('@/components/pages/Options/MapOptions')
const BeniAggiuntiTemp = () => import('@/components/pages/Bene/BeniAggiuntiTemp')
const manageUsers = () => import('@/components/pages/Utente/GestisciUtenti')

// solo per il debug OR true
const isAuthenticated = () => store.getters.loggedIn || true

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'loginPage',
      component: Login
    },
    {
      path: '/home',
      name: 'homePage',
      component: Home
    },
    {
      path: '/bene',
      component: {
        name: 'PageBene',
        template: '<router-view/>'
      },
      children: [
        {path: 'aggiungi',
          // addEditBene
          component: Bene,
          props: (route) => ({
            title: 'Aggiungi un bene',
            id: route.query.id
          })
        },
        {path: 'modifica/:id',
          // addEditBene
          component: Bene,
          props: (route) => ({
            title: 'Modifica Bene',
            id: route.query.id,
            editMode: true
          })
        },
        {path: 'ricerca',
          component: RicercaBeniApprovati,
          props: (route) => ({
            title: 'Ricerca/Modifica beni'
          })
        }
      ]
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
          props: (route) => ({
            id: route.query.id,
            disallowIDChange: true
          })
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
      path: '/mio_lavoro_beni',
      name: 'mioLavoroBeniPage',
      component: BeniAggiuntiTemp
    },
    {
      path: '/gestisci_utenti',
      name: 'manageUsersPage',
      component: manageUsers
    },
    {
      path: '/options',
      component: {
        name: 'optionsPage',
        template: '<router-view/>'
      },
      children: [
        {
          path: 'map',
          component: MyMapOptions
        }
      ]
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: Error404
    }
  ]
})

router.beforeEach(function (to, from, next) {
  let {path} = to
  // se vengo già dalla pagina di login si ha un loop
  if (path !== '/' && !isAuthenticated()) next('/')
  else next()
})

export default router
