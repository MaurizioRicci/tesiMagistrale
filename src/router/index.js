import Vue from 'vue'
import Router from 'vue-router'
import LoginWarning from '@/components/ui/LoginWarning'
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
        name: 'LoginWarningBene',
        components: { 'LoginWarning': LoginWarning, 'bene': Bene },
        template: '<LoginWarning><bene></bene></LoginWarning>'
      }
    },
    {
      path: '/dettagli_bene/:id',
      name: 'DettagliBene',
      component: ViewBene,
      props: true
    }
  ]
})
