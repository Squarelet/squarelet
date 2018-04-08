import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    squares: [],
    connections: [],
    height: 0
  },
  mutations: {
    addSquare (state, square) {
      var newSquares
      if (state.squares.length > 0) {
        newSquares = [...state.squares, square]
      } else {
        newSquares = [square]
      }
      Vue.set(state, 'squares', newSquares)
    },
    setHeight (state, h) {
      Vue.set(state, 'height', h)
    },
    changeHeight (state, delta) {
      Vue.set(state, 'height', state.height + delta)
    },
    setSquares (state, s) {
      Vue.set(state, 'squares', s)
    },
    setConnections (state, cs) {
      Vue.set(state, 'connections', cs)
    },
    updateSquare (state, sq) {
      let foundSquare = state.squares.findIndex(s => s.idx === sq.idx)
      if (foundSquare >= 0) {
        Vue.set(state.squares, foundSquare, sq)
      }
    },
    removeSquare (state, idx) {
      let foundSquare = state.squares.findIndex(s => s.idx == idx)
      if (foundSquare >= 0) {
        state.squares.splice(foundSquare, 1)
      }
    },
    saveSquares (state) {
      let ss = []
      for (let i = 0; i < state.squares.length; ++i) {
         ss.push(state.squares[i]._data)
      }
      localStorage.setItem('squares', JSON.stringify(ss))

      let cs = []
      for (let i = 0; i < state.connections.length; ++i) {
        cs.push({p1: state.connections[i].p1._data, p2: state.connections[i].p2._data})
      }

      localStorage.setItem('connections', JSON.stringify(cs))
      localStorage.setItem('height', JSON.stringify(state.height))
    },
    addConnection (state, connection) {
      let nc = [...state.connections, connection]
      Vue.set(state, 'connections', nc)
    }
  },
  actions: {

  },
  getters: {
    allSquares: function (state) { return state.squares },
    allConnections: function (state) { return state.connections },
    height: function (state) { return state.height }
  }
})
