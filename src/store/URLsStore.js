const serverURLsStore = {
  state: {
    serverURL: 'http://myserverapp',
    login: '/login.php',
    aggiungiBene: '/inserisci/bene/crea.php',
    filtraBeni: '/filtraBeni.php',
    filtraToponimo: '/filtraToponimi.php',
    filtraComune: '/filtraComuni.php',
    dettagliBene: '/visualizza/beni/dettagliBene.php',
    aggiungiRelazione: '/aggiungiRelazione.php',
    getDizionario: '/getDictionary.php',
    beniAggiuntiRevisione: '/visualizza/beni/beniAggiuntiRevisione.php',
    gestioneUtenti: '/manageUsers.php'
  },
  getters: {
    serverURL: state => state.serverURL,
    loginURL: state => state.serverURL + state.login,
    aggiungiBeneURL: state => state.serverURL + state.aggiungiBene,
    filtraBeniURL: state => state.serverURL + state.filtraBeni,
    filtraToponimoURL: state => state.serverURL + state.filtraToponimo,
    filtraComuneURL: state => state.serverURL + state.filtraComune,
    dettagliBeneURL: state => state.serverURL + state.dettagliBene,
    aggiungiRelazioneURL: state => state.serverURL + state.aggiungiRelazione,
    getDizionarioURL: state => state.serverURL + state.getDizionario,
    beniAggiuntiRevisioneURL: state => state.serverURL + state.beniAggiuntiRevisione,
    gestioneUtentiURL: state => state.serverURL + state.gestioneUtenti
  },
  mutations: {}
}

export default serverURLsStore
