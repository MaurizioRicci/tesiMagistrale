import pythonSlice from './pythonSlice'
import isInt from './isInt'

export default function dataVera (DS) {
/* /
# verifica che una stringa sia una data vera
# riceve in ingresso una stringa (1300, 13001231 ,XII, XI inizio, ...)
# la stringa può essere:
# a) un qualsiasi numero in formato stringa. Se ha 4 char o meno ('321') è un anno; se ha 5-8 char è a[aaa]mmgg  ATTENZIONE
# b) un numero romano: I,II,III,IV o IIII,V,VI,VII,VIII,IX,X,XI, XII, XIII, XIV, XV, XVI, XVII, XVIII, XIX, XX, XXI
# c) una stringa formata da (b) e seguita da inizio, fine, metà, prima METà, primametà, seCOnda metà, secondametà
# In questa versione la risoluzione è l'anno e manca 'a.C.'
# Restituisce true se è una data valida, altrimenti false
# NULL è considerato un valore valido per il campo. Controlli successivi valuteranno se è un valore coerente
# "" è considerato un valore valido per il campo.   Controlli successivi valuteranno se è un valore coerente
# "   " è considerato un valore NON valido per il campo.
# Elenco date che vengono definite vere (e false): 0,1,101,('1 01'),'',2000, 2019, (2020),(9999),11111,160229,(170229),170228, ...
# ... X, I, XX, (XXI), xinizio, 'x i n i zio',(inizio), xmetà, (xmeta)
/ */
  try {
    let annomax = new Date().getFullYear() // # ANNO CORRENTE cone anno max
    if (!DS) return true // # Se è NULL o stringa lunga 0 va bene (data ignota)
    if (DS.length === 0) return true
    // #sin = DS.replace(' ','')                    # Elimina tutti i blank NO !    '1300 1400' è un errore
    let sin = DS.trim()
    if (sin.length === 0) return false // # Era una stringa di blank !!!
    console.log(sin)
    if (isInt(sin)) { // # se ci sono solo numeri ...
      if (sin.length <= 4) { // # numero di <= 4 cifre: è solo anno
        if (Number(sin) > annomax) return false // # anno futuro = false
        else return true
      } else if (sin.length > 8) return false // # 5,6,7,8 cifre - se più di 8 cifre false
      let anno = pythonSlice(null, -4) // # ricorda - sono stringhe
      // sin[:-4];
      let mese = pythonSlice(-4, -2, sin)
      // sin[-4:-2];
      let giorno = pythonSlice(-2, null, sin)
      // sin[-2:]
      if (Number(anno) > annomax) return false
      let bisesto
      if (Number(anno) % 4 === 0 && ![2000, 1600, 1200, 800, 400].includes(Number(anno))) bisesto = true
      else bisesto = false
      if (Number(mese) in [1, 3, 5, 7, 8, 10, 12] && Number(giorno) <= 31) return true
      else if (Number(mese) in [4, 6, 9, 11] && Number(giorno) <= 30) return true
      else if (Number(mese) === 2 && bisesto && Number(giorno) <= 29) return true
      else if (Number(mese) === 2 && !bisesto && Number(giorno) <= 28) return true
      else return false
    }

    let RomToArab1 = ['I', 1, 'II', 2, 'III', 3, 'IIII', 4, 'IV', 4, 'V', 5, 'VI', 6, 'VII', 7, 'VIII', 8, 'IX', 9, 'VIIII', 9, 'X', 10]
    let RomToArab2 = ['XI', 11, 'XII', 12, 'XIII', 13, 'XIIII', 14, 'XIV', 14, 'XV', 15, 'XVI', 16, 'XVII', 17, 'XVIII', 18, 'XVIIII', 19, 'XIX', 19, 'XX', 20]
    let RomToArab = RomToArab1.concat(RomToArab2)
    let RomDett = ['inizio', 'fine', 'metà', 'primametà', 'secondametà']
    let re = new RegExp(' ', 'g')
    sin = sin.replace(re, '') // # ORA considero la stringa tutta packed
    let sinrem = sin
    for (let dett of RomDett) {
      let i = sin.toLowerCase().indexOf(dett) // # se nella stringa c'è inizio, fine o altro ...
      if (i >= 0)sinrem = pythonSlice(0, i, sin)
    }
    if (!RomToArab.includes(sinrem.toUpperCase())) return false
    return true
  } catch (error) {
    console.warn('eccezione in dataVera', error)
    return false
  }
}
