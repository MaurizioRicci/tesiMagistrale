export default {
  props: {
    noMenu: Boolean,
    noTitle: Boolean,
    title: String,
    backTo: [String, Object] // specifica a quale pagina torna con bottone indietro
  },
  methods: {
    goBack () {
      let numberOfEntries = window.history.length
      console.log(numberOfEntries || 0)
      if (this.backTo) {
        this.$router.push(this.backTo)
      } else if (numberOfEntries > 1) {
        this.$router.go(-1)
      } else this.$router.push('/home')
    }
  }
}
