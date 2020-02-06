export default function dataTipoVera (TS) {
// # verifica che una stringa sia un tipodata vera
// # riceve una stringa che può essere NULL, '', 'normale','niente prima','primaniente',
// # ... 'niente dopo','dopo niente', 'niente prima e dopo','prima e dopo niente'
// # NULL è considerato un valore valido per il campo. Controlli successivi valuteranno se è un valore coerente
// # I blank non contano: è corretto 'prima e dopo   ni ente' !!
// # restituisce True se TS è null o appartiene all'insieme; else False
// # Elenco stringhe che vengono definite vere (e false): (5),'',normale,(normal),(primanulla),primaniente, ...
// # ... 'prima niente', Prima niente
  try {
    if (!TS) return true
    if (TS.length === 0) return true
    let Tipi = ['normale', 'nienteprima', 'primaniente', 'nientedopo', 'doponiente', 'nienteprimaedopo', 'primaedoponiente']
    let re = new RegExp(' ', 'g')
    let TSnob = TS.replace(re, '')
    if (TSnob.length === 0) return false
    let TSnobmin = TSnob.toLowerCase()
    if (Tipi.includes(TSnobmin)) return true
    else return false
  } catch (error) {
    console.warn('dataTipoVera eccezione', error)
    return false
  }
}
