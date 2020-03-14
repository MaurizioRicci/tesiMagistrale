// Mixin per pagine generiche, definisce titolo della pagina,
// a quale pagina tornare indietro, se mostrare il menu
export default {
  props: {
    // vero se deve nascondere il menu
    noMenu: Boolean,
    // vero se deve nascondere il titolo della pagina
    noTitle: Boolean,
    // titolo della pagina personalizzato
    title: String,
    // specifica a quale pagina torna con bottone indietro
    backTo: [String, Object]
  },
  methods: {
    goBack () {
      // calcolo quante pagine ci sono nella storia (vedi le History API)
      let numberOfEntries = window.history.length
      // se è stata specificata una pagina ci vado
      if (this.backTo) {
        this.$router.push(this.backTo)
      } else if (numberOfEntries > 1) {
        // altrimenti se c'è una pagina a cui torna ci torno
        this.$router.go(-1)
      } else this.$router.push('/home')
      // se non c'è nessuna pagina indietro vado alla home
    }
  }
}
