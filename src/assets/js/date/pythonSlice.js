// Versione JS di python slice. Lavora su una stringa
// esempio Python: a[:-3:-1]
// equivale a pythonSlice(-3, -1, a)
export default function pythonSlice (i1, i2, str) {
  if (i1 !== null && typeof i1 !== 'undefined') {
    if (i1 >= 0) { str = str.substring(i1) } else { str = str.substring(str.length + i1) }
  }
  if (i2 !== null && typeof i2 !== 'undefined') {
    if (i2 >= 0) { str = str.substring(0, i2) } else { str = str.substring(0, str.length + i2) }
  }
  return str
}
