import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    squares: [],
    connections: [],
    height: 0,
    width: 100,
    editorState: 'default'
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
    setEditorState (state, editorState) {
      Vue.set(state, 'editorState', editorState)
    },
    setWidth (state, w) {
      Vue.set(state, 'width', w)
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
      console.log('FIND', sq.idx, sq)
      let foundSquare = state.squares.findIndex(s => s.idx === sq.idx)
      if (foundSquare >= 0) {
        console.log('SQUARE', sq._data)
        Vue.set(state.squares, foundSquare, sq)
      }
    },
    removeSquare (state, idx) {
      let foundSquare = state.squares.findIndex(s => s.idx == idx)
      if (foundSquare >= 0) {
        state.squares.splice(foundSquare, 1)
        let deleteConnections = []
        for (let i = 0; i < state.connections.length; ++i) {
          let connection = state.connections[i]
          if (connection.p1.idx === idx || connection.p2.idx === idx) {
            deleteConnections.push(i)
          }
        }
        let d = 0
        for (let i = 0; i < deleteConnections.length; ++i) {
          state.connections.splice(deleteConnections[i - d], 1)
          d += 1
        }
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
      localStorage.setItem('width', JSON.stringify(state.width))
    },
    addConnection (state, connection) {
      // Don't allow connection with itself (for now at least)
      if (connection.p1.idx === connection.p2.idx) {
        return
      }
      // Don't add duplicate connections
      for (let i = 0; i < state.connections.length; ++i) {
         let c = state.connections[i]
         if ((c.p1.idx === connection.p1.idx && c.p2.idx === connection.p2.idx) ||
             (c.p1.idx === connection.p2.idx && c.p2.idx === connection.p1.idx)) {
           return;
         }
      }
      let nc = [...state.connections, connection]
      Vue.set(state, 'connections', nc)
    }
  },
  actions: {

  },
  getters: {
    allSquares: function (state) { return state.squares },
    allConnections: function (state) { return state.connections },
    height: function (state) { return state.height },
    width: function (state) { return state.width },
    editorState: function (state) { return state.editorState }
  },
  plugins: [createPersistedState()]
})
