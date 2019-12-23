const AddEditFunzione = () => import('@/components/pages/Funzione/AddEditFunzione')
const ViewFunzione = () => import('@/components/pages/Funzione/ViewFunzione')
const ValidaFunzione = () => import('@/components/pages/Funzione/ValidaFunzione')
const RicercaFunzioniApprovate = () => import('@/components/pages/Funzione/FunzioniRicercaApprovate')
const FunzioniAggiunteTemp = () => import('@/components/pages/Funzione/FunzioniAggiunteTemp')

export default {
  path: '/funzione',
  component: {
    name: 'PageFunzione',
    template: '<router-view/>'
  },
  children: [
    {
      path: 'aggiungi',
      // AddEditFunzione
      component: AddEditFunzione,
      props: () => ({
        title: 'Aggiungi una funzione',
        backTo: '/home'
      })
    },
    {
      path: 'modifica/:id',
      // AddEditFunzione
      component: AddEditFunzione,
      props: (route) => ({
        title: 'Modifica una funzione',
        idFunzione: route.params.id,
        editMode: true
      })
    },
    {
      path: 'modifica/:id/:id_utente',
      // AddEditFunzione
      component: AddEditFunzione,
      props: (route) => ({
        idFunzione: route.params.id,
        idUtente: route.params.id_utente,
        cercaInArchivioTemp: true,
        editMode: true,
        title: 'Modifica una funzione temporanea'
      })
    },
    {
      path: 'ricerca',
      component: RicercaFunzioniApprovate,
      props: (route) => ({
        backTo: '/home'
      })
    },
    {
      path: 'dettagli_funzione',
      component: ViewFunzione,
      props: () => ({
      })
    },
    {
      path: 'dettagli_funzione/:id',
      component: ViewFunzione,
      props: (route) => ({
        idFunzione: route.params.id
      })
    },
    {
      path: 'dettagli_funzione/:id/:id_utente',
      component: ViewFunzione,
      props: (route) => ({
        idFunzione: route.params.id,
        idUtente: route.params.id_utente,
        cercaInArchivioTemp: true,
        title: 'Visualizza una funzione temporanea'
      })
    },
    {
      path: 'valida/:id/:id_utente',
      component: ValidaFunzione,
      props: (route) => ({
        idFunzione: route.params.id,
        idUtente: route.params.id_utente
      })
    },
    {
      path: 'mio_lavoro',
      name: 'mioLavoroFunzioniPage',
      component: FunzioniAggiunteTemp,
      props: () => ({
        backTo: '/home'
      })
    }
  ]
}
