// Vuex store per le URL
const serverURLsStore = {
  state: {
    // indirizzo del server. Se siamo in produzione (rilascio agli utenti finali) si usa un indirizzo
    // se stiamo sviluppando l'app si usa un'altro indirizzo.
    serverURL: process.env.NODE_ENV === 'production' ? 'http://beniinlunigiana.labcd.unipi.it' : 'http://myserverapp',
    login: '/login.php',
    gestioneUtenti: '/manageUsers.php',
    userStats: '/userStats.php',
    elencoProvince: '/options/map/elencoProvince.php', // per settare il centro della mappa di default
    getNewID: '/getNewID.php',
    shapeFile: '/downloadShapeFile.php',
    getLog: '/getLog.php',
    // URL per i beni
    aggiungiBene: '/inserisci/beni/crea.php',
    checkDist: '/inserisci/beni/checkDistance.php',
    modificaBene: '/modifica/beni/modifica.php',
    segnalaBene: '/valida/beni/segnala.php',
    cancellaBene: '/modifica/beni/cancellaTmp.php',
    cancellaBeneDef: '/modifica/beni/cancellaDef.php',
    approvaBene: '/valida/beni/valida.php',
    filtraIdent: '/filtraIdent.php',
    filtraToponimo: '/filtraToponimi.php',
    filtraComune: '/filtraComuni.php',
    dettagliBene: '/visualizza/beni/dettagliBene.php',
    getDizionario: '/getDictionary.php',
    beniAggiuntiTemp: '/visualizza/beni/beniAggiuntiTemp.php',
    beniAggiuntiApprovati: '/visualizza/beni/beniAggiuntiApprovati.php',
    beniMettiInRevisione: '/modifica/beni/mettiInRev.php',
    // URL per le funzioni
    aggiungiFunzione: '/inserisci/funzioni/crea.php',
    modificaFunzione: '/modifica/funzioni/modifica.php',
    segnalaFunzione: '/valida/funzioni/segnala.php',
    cancellaFunzione: '/modifica/funzioni/cancellaTmp.php',
    cancellaFunzioneDef: '/modifica/funzioni/cancellaDef.php',
    approvaFunzione: '/valida/funzioni/valida.php',
    dettagliFunzione: '/visualizza/funzioni/dettagliFunzione.php',
    funzioniAggiunteTemp: '/visualizza/funzioni/funzioniAggiunteTemp.php',
    funzioniAggiunteApprovate: '/visualizza/funzioni/funzioniAggiunteApprovate.php',
    funzioniMettiInRevisione: '/modifica/funzioni/mettiInRev.php'
  },
  getters: {
    serverURL: state => state.serverURL,
    loginURL: state => state.serverURL + state.login,
    gestioneUtentiURL: state => state.serverURL + state.gestioneUtenti,
    userStatsURL: state => state.serverURL + state.userStats,
    elencoProvinceURL: state => state.serverURL + state.elencoProvince,
    getNewIDURL: state => state.serverURL + state.getNewID,
    shapeFileURL: state => state.serverURL + state.shapeFile,
    getLogURL: state => state.serverURL + state.getLog,
    // URL per i beni
    aggiungiBeneURL: state => state.serverURL + state.aggiungiBene,
    checkDistURL: state => state.serverURL + state.checkDist,
    modificaBeneURL: state => state.serverURL + state.modificaBene,
    segnalaBeneURL: state => state.serverURL + state.segnalaBene,
    cancellaBeneURL: state => state.serverURL + state.cancellaBene,
    cancellaBeneDefURL: state => state.serverURL + state.cancellaBeneDef,
    approvaBeneURL: state => state.serverURL + state.approvaBene,
    filtraIdentURL: state => state.serverURL + state.filtraIdent,
    filtraToponimoURL: state => state.serverURL + state.filtraToponimo,
    filtraComuneURL: state => state.serverURL + state.filtraComune,
    dettagliBeneURL: state => state.serverURL + state.dettagliBene,
    aggiungiRelazioneURL: state => state.serverURL + state.aggiungiRelazione,
    getDizionarioURL: state => state.serverURL + state.getDizionario,
    beniAggiuntiTempURL: state => state.serverURL + state.beniAggiuntiTemp,
    beniAggiuntiApprovatiURL: state => state.serverURL + state.beniAggiuntiApprovati,
    beniMettiInRevisioneURL: state => state.serverURL + state.beniMettiInRevisione,
    // URL per le funzioni
    aggiungiFunzioneURL: state => state.serverURL + state.aggiungiFunzione,
    modificaFunzioneURL: state => state.serverURL + state.modificaFunzione,
    segnalaFunzioneURL: state => state.serverURL + state.segnalaFunzione,
    cancellaFunzioneURL: state => state.serverURL + state.cancellaFunzione,
    cancellaFunzioneDefURL: state => state.serverURL + state.cancellaFunzioneDef,
    approvaFunzioneURL: state => state.serverURL + state.approvaFunzione,
    dettagliFunzioneURL: state => state.serverURL + state.dettagliFunzione,
    funzioniAggiunteTempURL: state => state.serverURL + state.funzioniAggiunteTemp,
    funzioniAggiunteApprovateURL: state => state.serverURL + state.funzioniAggiunteApprovate,
    funzioniMettiInRevisioneURL: state => state.serverURL + state.funzioniMettiInRevisione
  }
}

export default serverURLsStore
