import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import stateTemplate from './template'
import Automerge from 'automerge'
import { sideCoords } from './utils/geom.js'

Vue.use(Vuex)

function closerSides(square1, square2) {
  let minDistance = 0
  let minCoords
  var distance = function (point1, point2) {
    return Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  }

  for (var i = 0; i < 4; ++i) {
    let point1 = sideCoords(square1, i)
    for (var j = 0; j < 4; ++j) {
      let point2 = sideCoords(square2, j)
      let newDistance = distance(point1, point2)
      if (minDistance === 0 || newDistance < minDistance) {
        minDistance = newDistance
        minCoords = [i, j]
      }
    }
  }

  return minCoords
}

export default new Vuex.Store({
  state: stateTemplate,
  mutations: {
    setState (state, newState) {
      state = newState
    },
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
    updateHistory (state, changes) {
      console.log('OBJ', state.history)
      let history = Automerge.load(localStorage.getItem('history'))
      let newHistory = Automerge.applyChanges(history, changes)
      localStorage.setItem('history', Automerge.save(newHistory))
    },
    setHeight (state, h) {
      Vue.set(state, 'height', h)
    },
    setLastZ (state, z) {
       Vue.set(state, 'lastZ', z)
    },
    changeHeight (state, delta) {
      Vue.set(state, 'height', state.height + delta)
    },
    setSquares (state, s) {
      Vue.set(state, 'squares', s)
    },
    updateSquareConnections (state, square) {
      for (var i in state.connections) {
        let con = state.connections[i]
        if (con.p1.idx === square.idx || con.p2.idx === square.idx) {
          con.coords = closerSides(con.p1, con.p2)
        }
      }
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
    setBgcolor (state, bgcolor) {
      Vue.set(state, 'bgcolor', bgcolor)
    },
    setBgurl (state, bgurl) {
      Vue.set(state, 'bgurl', bgurl)
    },
    removeConnection (state, connection) {
      let foundConnection = state.connections.findIndex(c => c == connection)
      if (foundConnection >= 0) {
          state.connections.splice(foundConnection, 1)
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

      connection.coords = closerSides(connection.p1, connection.p2)

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
    editorState: function (state) { return state.editorState },
    bgcolor: function (state) { return state.bgcolor },
    state: function (state) { return state },
    minWidth: function (state) { return state.minWidth },
    minHeight: function (state) { return state.minHeight },
    history: function (state) {
      let history = localStorage.getItem('history')
      if (!history) {
        let startHistory = Automerge.init()
        localStorage.setItem('history', Automerge.save(startHistory))
        return startHistory
      } else {
        return Automerge.load(history)
      }
    },
    lastZ: function (state) { return state.lastZ }
  },
  plugins: [createPersistedState()]
})
