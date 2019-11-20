// Vuex store per le URL
const serverURLsStore = {
  state: {
    serverURL: 'http://myserverapp',
    login: '/login.php',
    gestioneUtenti: '/manageUsers.php',
    userStats: '/userStats.php',
    // URL per i beni
    aggiungiBene: '/inserisci/bene/crea.php',
    filtraIdent: '/filtraIdent.php',
    filtraToponimo: '/filtraToponimi.php',
    filtraComune: '/filtraComuni.php',
    dettagliBene: '/visualizza/beni/dettagliBene.php',
    getDizionario: '/getDictionary.php',
    beniAggiuntiTemp: '/visualizza/beni/beniAggiuntiTemp.php',
    beniAggiuntiApprovati: '/visualizza/beni/beniAggiuntiApprovati.php'
    // URL per le funzioni
  },
  getters: {
    serverURL: state => state.serverURL,
    loginURL: state => state.serverURL + state.login,
    gestioneUtentiURL: state => state.serverURL + state.gestioneUtenti,
    userStatsURL: state => state.serverURL + state.userStats,
    // URL per i beni
    aggiungiBeneURL: state => state.serverURL + state.aggiungiBene,
    filtraIdentURL: state => state.serverURL + state.filtraBeni,
    filtraToponimoURL: state => state.serverURL + state.filtraToponimo,
    filtraComuneURL: state => state.serverURL + state.filtraComune,
    dettagliBeneURL: state => state.serverURL + state.dettagliBene,
    aggiungiRelazioneURL: state => state.serverURL + state.aggiungiRelazione,
    getDizionarioURL: state => state.serverURL + state.getDizionario,
    beniAggiuntiTempURL: state => state.serverURL + state.beniAggiuntiTemp,
    beniAggiuntiApprovatiURL: state => state.serverURL + state.beniAggiuntiApprovati
    // URL per le funzioni
  },
  mutations: {}
}

export default serverURLsStore
