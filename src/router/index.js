import Vue from 'vue'
import Router from 'vue-router'
import LoginWarning from '@/components/LoginWarning'
import LoginPage from '@/components/LoginPage'
import Bene from '@/components/AggiungiBene'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/aggiungiBene',
      name: 'aggiungiBene',
      component: {
        name: 'LoginWarningBene',
        components: { 'LoginWarning': LoginWarning, 'bene': Bene },
        template: '<LoginWarning><bene></bene></LoginWarning>'
      },
      props: { newsletterPopup: false }
    }
  ]
})
