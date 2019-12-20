const copiaIncollaStore = {
  state: {
    beneCopiato: null,
    funzioneCopiata: null
  },
  getters: {
    getBeneCopiato: state => state.beneCopiato,
    getFunzioneCopiata: state => state.funzioneCopiata
  },
  mutations: {
    copiaBene (state, beneModel) {
      state.beneCopiato = beneModel
    },
    copiaFunzione (state, funzioneModel) {
      state.funzioneCopiata = funzioneModel
    }
  }
}

export default copiaIncollaStore
