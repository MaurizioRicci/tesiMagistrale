export default (str, maxChars) => {
  if (!maxChars) maxChars = 50
  if (str) {
    if (str.length <= maxChars) return str
    else return str.substring(0, maxChars) + '...'
  }
}
