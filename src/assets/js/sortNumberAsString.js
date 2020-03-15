// usato per ordinare valori numerici espressi come stringhe per Vue tables
// fieldName è il nome del campo per cui ordinare
export default function (fieldName) {
  return function (ascending) {
    return function (a, b) {
      return sortNumberAsString(a[fieldName], b[fieldName], ascending)
    }
  }
}

// tratta le due stringhe come due numeri e ordina
export function sortNumberAsString (a, b, ascending) {
  a = Number(a)
  b = Number(b)
  a = isNaN(a) ? Number.MAX_SAFE_INTEGER : a
  b = isNaN(b) ? Number.MAX_SAFE_INTEGER : b
  return ascending ? a - b : b - a
}
