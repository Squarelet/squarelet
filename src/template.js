import Automerge from 'automerge'

export default {
  defaultBoard: {
    bgcolor: 'rgba(18,64,126,1)',
    bgurl: '',
    squares: [],
    connections: [],
    height: 0,
    width: 100,
    editorState: 'default',
    minHeight: 0,
    minWidth: 0,
    lastZ: 1,
    history: Automerge.init()
  }
}
