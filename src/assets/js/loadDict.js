import axios from 'axios'

// carica le voci dei dizionari controllati
let loadDescr = (T) => axios.get(T.$store.getters.getDizionarioURL + '?' + 'dict_name=descrizione')
let loadEsistenza = (T) => axios.get(T.$store.getters.getDizionarioURL + '?' + 'dict_name=esistenza')
let loadFunc = (T) => axios.get(T.$store.getters.getDizionarioURL + '?' + 'dict_name=funzione')
let loadMacroEpocaCar = (T) => axios.get(T.$store.getters.getDizionarioURL + '?' + 'dict_name=macroEpocaCar')
let loadMacroEpocaOrig = (T) => axios.get(T.$store.getters.getDizionarioURL + '?' + 'dict_name=macroEpocaOrig')
let loadRuolo = (T) => axios.get(T.$store.getters.getDizionarioURL + '?' + 'dict_name=ruolo')
let loadTipoData = (T) => axios.get(T.$store.getters.getDizionarioURL + '?' + 'dict_name=tipoData')

export {
  loadDescr,
  loadEsistenza,
  loadFunc,
  loadMacroEpocaCar,
  loadMacroEpocaOrig,
  loadRuolo,
  loadTipoData
}
