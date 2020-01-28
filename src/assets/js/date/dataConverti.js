import dataVera from './dataVera'
import pythonSlice from './pythonSlice'
import isInt from './isInt'

export default function dataConverti (DS) {
// # Converti stringa in dataante-datapost standard
// # riceve in ingresso una stringa (1300, XII, 8001225, XI inizio, ...)
// # la stringa può essere:
// # a) un qualsiasi numero in formato stringa ('1321' '29071946'  '25120')
// # b) un numero romano: I,II,III,IV o IIII,V,VI,VII,VIII,IX,X,XI, XII, XIII, XIV, XV, XVI, XVII, XVIII, XIX, XX, XXI
// # c) una stringa formata da (b) e seguita da inizio, fine, metà, primametà, seconda    metà
// # In questa versione la risoluzione è l'anno e manca 'a.C.'
// # Restituisce (data1, data2) relativi alla data DS
// # Se data ignota, restituisce (9999,9999)
// # Prima controlla se DataValida e se non valida restituisce (-1,-1)
// # Se le due date sono uguali era un singolo anno; se diverse era un periodo romano
// # Restituisce due valori (annoA,annoP)  -  Se sono 9999,9999 l'anno è sconosciuto
// # NULL e stringa lunga 0 è considerato un valore che indica Data sconosciuta.
  try {
    if (!dataVera(DS)) return [-1, -1]
    if (!DS) return [9999, 9999] // # 9999 indica Data Sconosciuta <<<<<<<>>>>>>>
    if (DS.length === 0) return [9999, 9999] // # MI SEMBRA CHE DOVREBBE ESSERE TRUE - Perchè ??????????????????
    let re = new RegExp(' ', 'g')
    let sin = DS.replace(re, '') // # Elimina tutti i blank
    if (isInt(sin)) { // # se ci sono solo numeri ...
      if (sin.length <= 4) return [Number(sin), Number(sin)] // # numero di <= 4 cifre: è solo anno
      else {
        return [Number(pythonSlice(null, -4, sin)), // # cifre dalla quintultima in su
          Number(pythonSlice(null, -4, sin))]
      }
    }
    let RomToArab1 = ['I', 1, 'II', 2, 'III', 3, 'IIII', 4, 'IV', 4, 'V', 5, 'VI', 6, 'VII', 7, 'VIII', 8, 'IX', 9, 'VIIII', 9, 'X', 10]
    let RomToArab2 = ['XI', 11, 'XII', 12, 'XIII', 13, 'XIIII', 14, 'XIV', 14, 'XV', 15, 'XVI', 16, 'XVII', 17, 'XVIII', 18, 'XVIIII', 19, 'XIX', 19, 'XX', 20, 'XXI', 21]
    let RomToArab = RomToArab1.concat(RomToArab2)
    let RomDett = ['inizio', 'fine', 'metà', 'primametà', 'secondametà']

    let sispart = '' // # inizializzazione
    let sinsec = sin // # cerca il secolo. forse è solo ...
    for (let dett of RomDett) { // # ... a meno che ...
      let i = sin.toLowerCase().indexOf(dett) // # ... nella stringa ci sia inizio, fine o altro ...
      if (i >= 0) { // # Se c'è "inizio" o altro ...
        sinsec = pythonSlice(null, i, sin) // sin[:i]                      //# ... di 'Xinizio' qui resta 'X'
        sispart = pythonSlice(i, null, sin) // sin[i:]                     //# ... di 'Xinizio' qui resta 'inizio'
      }
    }
    sinsec = sinsec.toUpperCase()
    sispart = sispart.toLowerCase()
    let secolonum
    for (let i = 0; i < RomToArab.length; i++) {
      if (sinsec === RomToArab[i]) secolonum = RomToArab[i + 1] // # secolo 'X' diventa 10
    }
    let anno1 = (secolonum - 1) * 100 + 1
    let anno2 = anno1 + 99 // # 1401-1500
    let meta = Number((anno2 - anno1) / 2)
    let quarto = Number(meta / 2)
    if (sispart === 'inizio') { // # 1401-1425
      anno2 = anno1 + quarto
    } else if (sispart === 'fine') { // # 1476-1500
      anno1 = anno2 - quarto
    } else if (sispart === 'metà') { // # 1426-1475
      anno1 = anno1 + meta - quarto
      anno2 = anno1 + meta
    } else if (sispart === 'primametà') { // # 1401-1450
      anno2 = anno1 + meta
    } else if (sispart === 'secondametà') { // # 1451-1500
      anno1 = anno2 - meta
    }

    return [anno1, anno2]
  } catch (error) {
    console.warn('eccezione in dataConverti', error)
    return [-1, -1]
  }
}
