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
    setState (state, { boardId, newState }) {
      // state = { ...state, [boardId]: newState }
      Vue.set(state, boardId, newState)
    },
    addSquare (state, { boardId, square }) {
      var newSquares
      if (state[boardId].squares.length > 0) {
        newSquares = [ ...state[boardId].squares, square ]
      } else {
        newSquares = [ square ]
      }
      // Vue.set(state, 'squares', newSquares)
      // state = { ...state, [boardId]: { ...state[boardId], squares: newSquares } }
      Vue.set(state, boardId, { ...state[boardId], squares: newSquares })
    },
    setEditorState (state, editorState) {
      Vue.set(state, 'editorState', editorState)
    },
    setWidth (state, { boardId, w }) {
      // Vue.set(state, 'width', w)
      // state = { ...state, [boardId]: { ...state[boardId], width: w } }
      Vue.set(state, boardId, { ...state[boardId], width: w } )
    },
    updateHistory (state, changes) {
      let history = Automerge.load(localStorage.getItem('history'))
      let newHistory = Automerge.applyChanges(history, changes)
      localStorage.setItem('history', Automerge.save(newHistory))
    },
    setHeight (state, { boardId, h }) {
      // Vue.set(state, 'height', h)
      // state = { ...state, [boardId]: { ...state[boardId], height: h } }
      Vue.set(state, boardId, { ...state[boardId], height: h })
    },
    setLastZ (state, { boardId, z }) {
      // Vue.set(state, 'lastZ', z)
       //state = { ...state, [boardId]: { ...state[boardId], lastZ: z } }
      Vue.set(state, boardId, { ...state[boardId], lastZ: z })
    },
    changeHeight (state, { boardId, delta }) {
      // Vue.set(state, 'height', state.height + delta)
      // state = { ...state, [boardId]: { ...state[boardId], height: state[boardId]['height'] + delta } }
      Vue.set(state, boardId, { ...state[boardId], height: state[boardId]['height'] + delta })
    },
    setSquares (state, { boardId, s }) {
      // Vue.set(state, 'squares', s)
      // state = { ...state, [boardId]: { ...state[boardId], squares: s } }
      Vue.set(state, boardId, { ...state[boardId], squares: s })
    },
    updateSquareConnections (state, { boardId, square }) {
      for (var i in state[boardId].connections) {
        let con = state[boardId].connections[i]
        if (con.p1.idx === square.idx || con.p2.idx === square.idx) {
          con.coords = closerSides(con.p1, con.p2)
        }
      }
    },
    setConnections (state, { boardId, connections }) {
      // Vue.set(state, 'connections', cs)
      // state = { ...state, [boardId]: { ...state[boardId], connections: cs } }
      Vue.set(state, boardId, { ...state[boardId], connections: connections })
    },
    updateSquare (state, { boardId, square }) {
      let foundSquare = state[boardId].squares.findIndex(s => s.idx === square.idx)
      if (foundSquare >= 0) {
        // Vue.set(state.squares, foundSquare, sq)
        let newSquares = state[boardId].squares
        newSquares[foundSquare] = square
        // state = { ...state, [boardId]: { ...state[boardId], squares: newSquares } }
        Vue.set(state, boardId, { ...state[boardId], squares: newSquares })
      }
    },
    setBgcolor (state, { boardId, bgcolor }) {
      // Vue.set(state, 'bgcolor', bgcolor)
      // state = { ...state, [boardId]: { ...state[boardId], bgcolor: bgcolor } }
      Vue.set(state, boardId, { ...state[boardId], bgcolor: bgcolor })
    },
    setBgurl (state, { boardId, bgurl }) {
      // Vue.set(state, 'bgurl', bgurl)
      // state = { ...state, [boardId]: { ...state[boardId], bgurl: bgurl } }
      Vue.set(state, boardId, { ...state[boardId], bgurl: bgurl })
    },
    removeConnection (state, { boardId, connection }) {
      let foundConnection = state[boardId].connections.findIndex(c => c == connection)
      if (foundConnection >= 0) {
          state[boardId].connections.splice(foundConnection, 1)
      }
    },
    removeSquare (state, { boardId, idx }) {
      let foundSquare = state[boardId].squares.findIndex(s => s.idx == idx)
      if (foundSquare >= 0) {
        let newConnections = state[boardId].connections.filter(c => c.p1.idx !== idx && c.p2.idx !== idx)
        // Vue.set(state, 'connections', newConnections)
        // state = { ...state, [boardId]: { ...state[boardId], connections: newConnections } }
        Vue.set(state, boardId, { ...state[boardId], connections: newConnections })
        state[boardId].squares.splice(foundSquare, 1)
      }
    },
    addConnection (state, { boardId, connection }) {
      // Don't allow connection with itself (for now at least)
      if (connection.p1.idx === connection.p2.idx) {
        return
      }
      // Don't add duplicate connections
      for (let i = 0; i < state[boardId].connections.length; ++i) {
         let c = state[boardId].connections[i]
         if ((c.p1.idx === connection.p1.idx && c.p2.idx === connection.p2.idx) ||
             (c.p1.idx === connection.p2.idx && c.p2.idx === connection.p1.idx)) {
           return;
         }
      }

      connection.color = 'rgb(140, 182, 164)'
      connection.width = 5
      connection.dashed = false
      connection.dashedA = 5
      connection.dashedB = 5
      connection.idx = Math.random().toString(36).substring(2)
      connection.coords = closerSides(connection.p1, connection.p2)

      let nc = [...state[boardId].connections, connection]
      // Vue.set(state, 'connections', nc)
      // state = { ...state, [boardId]: { ...state[boardId], connections: nc } }
      Vue.set(state, boardId, { ...state[boardId], connections: nc })
    }
  },
  actions: {

  },
  getters: {
    allSquares: (state) => (boardId) => { return state[boardId].squares },
    allConnections: (state) => (boardId) => { return state[boardId].connections },
    height: (state) => (boardId) => { return state[boardId].height },
    width: (state) => (boardId) => { return state[boardId].width },
    editorState: (state) => (boardId) => { return state[boardId].editorState },
    bgcolor: (state) => (boardId) => { return state[boardId].bgcolor },
    state: (state) => (boardId) => { return state[boardId] },
    minWidth: (state) => (boardId) => { return state[boardId].minWidth },
    minHeight: (state) => (boardId) => { return state[boardId].minHeight },
    lastZ: (state) => (boardId) => { return state[boardId].lastZ },
    boards: (state) => { return Object.keys(state).filter(i => i !== 'editorState') }
  },
  plugins: [createPersistedState()]
})
