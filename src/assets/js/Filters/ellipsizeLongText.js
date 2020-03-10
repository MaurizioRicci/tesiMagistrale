// filtro per Vue, taglia i testi troppo lunghi aggiungendo i puntini
export default (str, maxChars = 50) => {
  if (str) {
    if (str.length <= maxChars || maxChars <= 0) return str
    else return str.substring(0, maxChars) + '...'
  }
}
