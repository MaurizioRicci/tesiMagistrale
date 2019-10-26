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
        data () { return {prevPath: ''} },
        beforeRouteEnter (to, from, next) {
          next(vm => {
            // access to component instance via `vm`
            // controllo che from non sia uguale alla route corrente
            vm.prevPath = from.path === to.path ? 'home' : from
          })
        },
        template: '<MasterPage><LoginPage :go-to="prevPath"/></MasterPage>'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: {
        name: 'PageHome',
        components: { MasterPage },
        template: '<MasterPage><h1>Home</h1></MasterPage>'
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
      path: '/dettagli_bene',
      component: {
        name: 'PageDettagliBene',
        components: {MasterPage},
        template: '<MasterPage/>'
      },
      children: [
        {path: '',
          component: {
            components: { MasterPage, ViewBene },
            template: '<ViewBene/>'
          }
        },
        {path: ':id',
          component: {
            props: {id: String},
            components: { MasterPage, ViewBene },
            template: '<ViewBene :id="id"/>'
          },
          props: true
        }
      ]
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
