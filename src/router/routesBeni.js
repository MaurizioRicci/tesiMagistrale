const AddEditBene = () => import('@/components/pages/Bene/AddEditBene')
const ViewBene = () => import('@/components/pages/Bene/ViewBene')
const ValidaBene = () => import('@/components/pages/Bene/ValidaBene')
const RicercaBeniApprovati = () => import('@/components/pages/Bene/BeniRicercaApprovati')
const BeniAggiuntiTemp = () => import('@/components/pages/Bene/BeniAggiuntiTemp')

export default {
  path: '/bene',
  component: {
    name: 'PageBene',
    template: '<router-view/>'
  },
  children: [
    {
      path: 'aggiungi',
      // addEditBene
      component: AddEditBene,
      props: () => ({
        title: 'Aggiungi un bene',
        backTo: '/home'
      })
    },
    {
      path: 'modifica/:id',
      // addEditBene
      component: AddEditBene,
      props: (route) => ({
        title: 'Modifica un bene',
        idBene: route.params.id,
        editMode: true
      })
    },
    {
      path: 'modifica/:id/:id_utente',
      // addEditBene
      component: AddEditBene,
      props: (route) => ({
        idBene: route.params.id,
        idUtente: route.params.id_utente,
        cercaInArchivioTemp: true,
        editMode: true,
        title: 'Modifica un bene temporaneo'
      })
    },
    {
      path: 'ricerca',
      component: RicercaBeniApprovati,
      props: () => ({
      })
    },
    {
      path: 'dettagli_bene',
      component: ViewBene,
      props: () => ({
      })
    },
    {
      path: 'dettagli_bene/:id',
      component: ViewBene,
      props: (route) => ({
        idBene: route.params.id,
        disallowIDChange: true
      })
    },
    {
      path: 'dettagli_bene/:id/:id_utente',
      component: ViewBene,
      props: (route) => ({
        idBene: route.params.id,
        idUtente: route.params.id_utente,
        cercaInArchivioTemp: true,
        disallowIDChange: true,
        title: 'Visualizza un bene temporaneo'
      })
    },
    {
      path: 'valida/:id/:id_utente',
      component: ValidaBene,
      props: (route) => ({
        idBene: route.params.id,
        idUtente: route.params.id_utente
      })
    },
    {
      path: 'mio_lavoro',
      name: 'mioLavoroBeniPage',
      component: BeniAggiuntiTemp,
      props: () => ({
        backTo: '/home'
      })
    }
  ]
}
