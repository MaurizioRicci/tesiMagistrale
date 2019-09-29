const axios = require('axios')

let loadDescr = (T) => axios.get(T.$store.getters.getDizionario + '?' + 'dict_name=descrizione')
let loadEsistenza = (T) => axios.get(T.$store.getters.getDizionario + '?' + 'dict_name=esistenza')
let loadFunc = (T) => axios.get(T.$store.getters.getDizionario + '?' + 'dict_name=funzione')
let loadMacroEpocaCar = (T) => axios.get(T.$store.getters.getDizionario + '?' + 'dict_name=macroEpocaCar')
let loadMacroEpocaOrig = (T) => axios.get(T.$store.getters.getDizionario + '?' + 'dict_name=macroEpocaOrig')
let loadRuolo = (T) => axios.get(T.$store.getters.getDizionario + '?' + 'dict_name=ruolo')
let loadTipoData = (T) => axios.get(T.$store.getters.getDizionario + '?' + 'dict_name=tipoData')

export {
  loadDescr,
  loadEsistenza,
  loadFunc,
  loadMacroEpocaCar,
  loadMacroEpocaOrig,
  loadRuolo,
  loadTipoData
}
