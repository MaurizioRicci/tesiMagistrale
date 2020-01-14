import lodashclonedeep from 'lodash.clonedeep'

const copiaIncollaStore = {
  state: {
    beneCopiato: [],
    funzioneCopiata: []
  },
  getters: {
    getBeneCopiato: state => state.beneCopiato,
    getFunzioneCopiata: state => state.funzioneCopiata
  },
  mutations: {
    copiaBene (state, beneModel) {
      state.beneCopiato.push(lodashclonedeep(beneModel))
    },
    copiaFunzione (state, funzioneModel) {
      state.funzioneCopiata.push(lodashclonedeep(funzioneModel))
    }
  }
}

export default copiaIncollaStore
