const infoBeniStore = {
  state: {
    beneUltimoID: Number.MIN_VALUE
  },
  getters: {
    beneUltimoID: state => state.beneUltimoID
  },
  mutations: {
    acquisisciBeneUltimoID (state, id) {
      // attenzione: Number('') -> 0
      if (id !== '' && !isNaN(Number(id))) {
        state.beneUltimoID = Number(id)
      }
    },
    incrementaBeneUltimoID (state, n = 1) {
      state.beneUltimoID += n
    }
  }
}

export default infoBeniStore
