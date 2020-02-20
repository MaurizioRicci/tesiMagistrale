import axios from 'axios'
let cached = {}

function getOrCache (url) {
  if (!cached[url]) {
    return axios.get(url).then(resp => {
      cached[url] = resp
      return resp
    })
  }
  return Promise.resolve(cached[url])
}

// carica le voci dei dizionari controllati
let loadDescr = (T) => getOrCache(T.$store.getters.getDizionarioURL + '?' + 'dict_name=descrizione')
let loadEsistenza = (T) => getOrCache(T.$store.getters.getDizionarioURL + '?' + 'dict_name=esistenza')
let loadFunc = (T) => getOrCache(T.$store.getters.getDizionarioURL + '?' + 'dict_name=funzione')
let loadMacroEpocaCar = (T) => getOrCache(T.$store.getters.getDizionarioURL + '?' + 'dict_name=macroEpocaCar')
let loadMacroEpocaOrig = (T) => getOrCache(T.$store.getters.getDizionarioURL + '?' + 'dict_name=macroEpocaOrig')
let loadRuolo = (T) => getOrCache(T.$store.getters.getDizionarioURL + '?' + 'dict_name=ruolo')
let loadTipoData = (T) => getOrCache(T.$store.getters.getDizionarioURL + '?' + 'dict_name=tipoData')

export {
  loadDescr,
  loadEsistenza,
  loadFunc,
  loadMacroEpocaCar,
  loadMacroEpocaOrig,
  loadRuolo,
  loadTipoData
}
