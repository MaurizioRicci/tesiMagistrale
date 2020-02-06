import dataVera from './dataVera'
import dataConverti from './dataConverti'
// import dataTipoVera from './dataTipoVera'

export default function ternaVera (DataA, DataP, DataTipo) {
  // # CONTROLLO dei tre valori di Data3
  // # riceve una Data3 formata da DataA, DataP, DataTipo.
  // # Prima controlla che i valori siano "validi" come valori isolati
  // # Restituisce True, se la terna ha coerenza tra i 3 valori; altrimenti False
  // # NULL è un valore valido che, nei calcoli, è trattato come '', ma nel DB resta NULL
  try {
    // DataTipo è presa da una select dinamica non può essere errata. No hard code valori nel codice
    // if (!dataVera(DataA) || !dataVera(DataP) || !dataTipoVera(DataTipo)) return false
    if (!dataVera(DataA) || !dataVera(DataP)) return false
    let DataA2 = dataConverti(DataA) // # DataA2 è una lista [Data1, Data2]
    let DataP2 = dataConverti(DataP)
    if (!DataTipo) DataTipo = ''

    if (DataA2[0] === 9999) {
      if (DataP2[0] === 9999 && DataTipo === '') {
        return true
      } else return false // # Data errata (DataA sconosciuta e valori sul resto)
    }
    if (DataP2[1] < DataA2[0]) return false
    else return true
  } catch (error) {
    console.warn('ternaVera eccezione', error)
    return false
  }
}
