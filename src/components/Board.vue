<template>
  <div class="squares" :style="{'max-height': heightN + 'px', 'background-color': bgcolor}">
    <div class="toolbar">
      <el-button class="action" @click.stop.prevent="zoomOutSquare()" type="primary" v-if="uiState === 2">
          Back <i class="el-icon-zoom-out"></i>
      </el-button>
      <el-dropdown @command="handleDropdownMenu" trigger="click" v-if="uiState !== 2">
        <el-button type="primary">
          Edit<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <template slot="title">Edit</template>
          <el-dropdown-item command="background">
            <i class="el-icon-picture"></i>Background
          </el-dropdown-item>
          <el-dropdown-item command="download">
            <i class="el-icon-download"></i>Download
          </el-dropdown-item>
          <el-dropdown-item command="load">
            <i class="el-icon-upload"></i>Load
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <LoadFile @updatedState="updateConnections" @close="loadFileVisible = false" :visible="loadFileVisible"></LoadFile>
      <el-dialog
        title="Background settings"
        :visible.sync="backgroundSettingsVisible"
        :modal="false"
        width="30%">
        <el-color-picker
           show-alpha
           v-model="bgcolor"
           @active-change="onChangeBgcolor"
           :predefine="predefineColors">
        </el-color-picker>
        <p/>
        <el-form>
          <el-form-item label="Background image URL">
            <el-input v-model="bgurl"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="backgroundSettingsVisible = false">Cancel</el-button>
          <el-button type="primary" @click="backgroundSettingsVisible = false">Confirm</el-button>
        </span>
      </el-dialog>
    <!-- <el-button @click="addSquare({x:20, y: offsetY() + 80, text: '', width: 200, height: 200, idx: Math.random().toString(36).substring(2)})" type="primary" icon="el-icon-circle-plus">Add</el-button>
      <el-button @click="isCollapse = false" type="primary" icon="el-icon-check">Save</el-button> -->
    </div>
    <div class="board" :style="{'position': boardPosition, 'height': heightN + 'px', 'width': widthN + 'px', 'transform-origin': '0 0', 'transform': `scale(${zoom}) translateX(${translateX}) translateY(${translateY})`, 'background-image': `url(${bgurl})`, 'background-color': bgcolor}">
      <svg @dblclick.prevent.stop="addSquareOnCursor($event)" preserveAspectRatio="xMidYMid meet" :viewBox="`0 0 ${widthN} ${heightN}`" class="backgroundScreen">
        <line @click="onClickConnection($event, c)" :x1="c.p1.x + c.p1.width" :y1="c.p1.y + c.p1.height/2.0" :x2="c.p2.x" :y2="c.p2.y + c.p2.height/2.0" v-for="(c,index) in allConnections" :key=index style="stroke:rgb(140, 182, 164);stroke-width:5" />
      </svg>
      <div v-if="showConnectionEditor" class="connection-editor" :style="{left: conEditorLeft, top: conEditorTop}">
        <el-button class="action" @click="onRemoveConnection" type="danger" icon="el-icon-delete" circle></el-button>
      </div>
      <Square @activated="onActivated" @squaresMoved="createConnections" :zoom="zoom" :itext="s.text" :icolor="s.color" :iidx="s.idx" :ix="s.x" :iy="s.y" :iwidth="s.width" :iheight="s.height" v-for="(s, index) in allSquares" :key="s.idx"></Square>
    </div>
    <div class="square-border" v-for="(s, index) in allSquares" :key="s.idx"
        :style="{'top': `${s.y*zoom - 50}px`, 'left': `${(s.x - 10)*zoom}px`, 'width': `${(s.width + 20)*zoom}px`, 'height': '40px'}">
      <el-row class="actions" v-if="s.showActions">
        <el-button class="action" @click.stop.prevent="openEditor(s, $event)" type="primary" icon="el-icon-edit" circle></el-button>
        <el-button class="action" @click="onConnect(s)" type="success" icon="el-icon-share" circle></el-button>
        <el-button class="action" @click="zoomSquare(s)" type="success" icon="el-icon-zoom-in" circle></el-button>
        <el-button class="action right" @click="removeSquare(s.idx)" type="danger" icon="el-icon-delete" circle></el-button>
        <!-- <el-button :style="{'background-color': s.color, 'border-color': 'rgba(0,0,0,0.3)'}"  @click="s.selectColor()" type="success" icon="el-icon-edit" circle></el-button> -->
      </el-row>
    </div>
    <div @click="closeEditorOnClick($event)" class="cover" :style="{'z-index': (showEditor)?'15':'0'}">
      <div class="square-editor" :style="{'opacity': (showEditor)? (editorOpacity): '0', 'visibility': (showEditor)? 'visible' : 'hidden'}">
        <markdown-editor v-if="editSquare.editing" :id="'contentEditor-' + editSquare.idx" :class="{'is-editing': editSquare.editing}" v-model="editSquare.text" :height="300" :zIndex="20"></markdown-editor>
      </div>
    </div>
  </div>
</template>

<script>

import MarkdownEditor from './MarkdownEditor'
import Square from './Square'
import { mapGetters, mapMutations  } from 'vuex'
import LoadFile from './LoadFiles'

const uiStates = {'DEFAULT': 0, 'SELECTED_SQUARE': 1, 'ZOOM_ON_SQUARE': 2, 'EDITING_SQUARE': 3}

export default {
  name: 'SquareBoard',
  components: { Square, MarkdownEditor, LoadFile },
  props: {
  },
  sockets: {
    'squares': function (data) {
      // this.$store.replaceState(data)
    }
  },
  data: function () {
    return {
      uiState: uiStates['DEFAULT'],
      squareOnZoom: {},
      selectedConnection: {},
      conEditorTime: 0,
      showConnectionEditor: false,
      loadFileVisible: false,
      conEditorLeft: 0,
      conEditorTop: 0,
      origWidth: 0,
      origHeight: 0,
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      editSquare: {},
      editorOpacity: 1,
      zoom: 1,
      zoomLevel: 0,
      controlDown: false,
      connectionMode: false,
      connectionTmp: [],
      heightNum: 0,
      lastScroll: 0,
      translateX: 0,
      translateY: 0,
      showEditor: false,
      backgroundSettingsVisible: false
    }
  },
  created () {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keypress', this.onKeyPress)
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.onResize)

    this.origWidth = window.innerWidth
    this.origHeight = window.innerHeight

    if (this.width > this.origWidth) {
      this.origWidth = this.width
    } else {
      this.setWidth(this.origWidth)
    }

    if (this.height > this.origHeight) {
      this.origHeight = this.height
    } else {
      this.setHeight(this.origHeight)
    }

    this.$nextTick(() => {
      this.updateConnections()
      // let vuex = localStorage.getItem('vuex')
      // this.$socket.emit('update', vuex)
    })


  },
  computed: {
    bgurl: {
      get () {
        return this.$store.state.bgurl
      },
      set (bgurl) {
        this.$store.commit('setBgurl', bgurl)
      }
    },
    bgcolor: {
      get () {
        return this.$store.state.bgcolor
      },
      set (color) {
        this.$store.commit('setBgcolor', color)
      }
    },
    heightN: function () {
      return this.height
    },
    widthN: function () {
      return this.width
    },
    boardPosition: function () {
      switch (this.uiState) {
        case uiStates['EDITING_SQUARE']:
          return 'fixed'
        default:
          return 'absolute'
      }
    },
    ...mapGetters([
      'allSquares', 'allConnections', 'height', 'width', 'board', 'boardString', 'state'
    ])
  },
  methods: {
    closeEditorOnClick: function (event) {
      if (event.target.className === 'cover') {
        this.closeEditor()
        this.boardDisplay = 'block'
      }
    },
    closeEditor: function () {
      this.showEditor = false
      this.uiState = uiStates['DEFAULT']
    },
    openEditor: function (square, e) {
      if (e.stopPropagation) e.stopPropagation()
      if (e.preventDefault) e.preventDefault()

      this.editSquare = square
      this.editSquare.editing = true
      this.showEditor = true
      this.uiState = uiStates['EDITING_SQUARE']
      this.boardDisplay = 'fixed'
    },
    changeEditorOpacity: function () {
      this.editorOpacity = (this.editorOpacity == 1) ? 0.3 : 1
    },
    offsetY: function () {
      return window.scrollY
    },
    offsetX: function () {
      return window.scrollX
    },
    zoomOutSquare: function () {
      this.zoom = 1
      this.translateX = 0
      this.translateY = 0
      this.uiState = uiStates['DEFAULT']
      this.squareOnZoom.showActions = true
    },
    zoomSquare: function (square) {
      this.squareOnZoom = square
      let scale = (window.innerWidth - 80)/square.width
      square.showActions = false
      this.translateX = -square.x + 40/scale + 'px'
      this.translateY = -square.y  + 40/scale + 'px'
      this.zoom = scale
      this.uiState = uiStates['ZOOM_ON_SQUARE']
    },
    updateConnections: function () {
      console.log('UPDATE')
      let cs = this.allConnections
      if (cs) {
        let new_cs = []
        for (let i = 0; i < cs.length; ++i) {
           let sq1 = this.allSquares.find(s => s.idx == cs[i].p1.idx)
           let sq2 = this.allSquares.find(s => s.idx == cs[i].p2.idx)

           new_cs.push({p1: sq1, p2: sq2})
        }
        this.setConnections(new_cs)
      } else {
        this.setConnections([])
      }
    },
    addSquareOnCursor: function (event) {
      if (event.stopPropagation) event.stopPropagation()
      if (event.preventDefault) event.preventDefault()
      this.addSquare({x: (this.offsetX() + event.clientX)/this.zoom, y: (this.offsetY() + event.clientY)/this.zoom, text: '', width: 200, height: 200, idx: Math.random().toString(36).substring(2)})
    },
    handleDropdownMenu: function (event) {
      switch (event) {
        case 'background':
          this.backgroundSettingsVisible = true
          break

        case 'download':
          this.onDownloadPad()
          break

        case 'load':
          this.loadFileVisible = true
          break
      }
    },
    onChangeBgcolor: function (color) {
      this.bgcolor = color
    },
    onConnect: function (square) {
      this.connectionMode = true
      this.connectionTmp.push(square)
    },
    onKeyDown: function (event) {
      switch (this.uiState) {
        case uiStates['DEFAULT']:
          switch (event.key) {
            default:
              console.log(event)
              break
          }
          break
        case uiStates['ZOOM_ON_SQUARE']:
          switch (event.key) {
            case 'Escape':
              this.zoomOutSquare()
              break
          }
          break
        case uiStates['EDITING_SQUARE']:
          switch (event.key) {
            case 'Escape':
              this.closeEditor()
              break
          }
      }
    },
    onKeyPress: function (event) {
      console.log(event)
      switch (event.key) {
        case 'z':
          switch (this.uiState) {
            case 0:
              this.changeZoom(+1)
              break
            default:
              break
          }
          break;
        case 'Z':
          switch (this.uiState) {
            case 0:
              this.changeZoom(-1)
              break
            default:
              break
          }
          break
        default:
          console.log('KEY', event.keyCode);
          break
      }
    },
    onResize: function (event) {
      if (this.height < window.innerHeight) {
        this.setHeight(window.innerHeight)
      }
      if (this.width < window.innerWidth) {
        this.setWidth(window.innerWidth)
      }
    },
    changeZoom: function (inc) {
      if (inc >= 1) {
        if (this.zoom === 0.2) {
          return
        }
        this.zoomLevel += 1
        let newZoom = 1  - this.zoomLevel * 0.2
        this.zoom = (newZoom >= 0.2) ? newZoom: 0.2
        this.setWidth(this.origWidth / this.zoom)
        this.setHeight(this.origHeight / this.zoom)
        console.log('ZOOM OUT',  this.zoom, this.zoomLevel, this.width, this.height)
      } else {
        console.log('ZOOM IN', this.zoom, this.zoomLevel, this.width, this.height)
        this.zoomLevel -= 1
        this.setWidth(this.origWidth / (1 - this.zoomLevel*0.2))
        this.setHeight(this.origHeight / (1 - this.zoomLevel*0.2))
        this.zoom = 1 - this.zoomLevel * 0.2
        console.log('ZOOM IN', this.zoom, this.zoomLevel, this.width, this.height)
      }
    },
    onActivated: function (event) {
      if (this.connectionMode) {
        let sq1 = this.allSquares.find(s => s.idx == this.connectionTmp[0].idx)
        let sq2 = this.allSquares.find(s => s.idx == event)

        this.addConnection({p1: sq1, p2: sq2})
        this.connectionMode = false
        this.connectionTmp = []
      }
    },
    createConnections: function () {
    },
    onClickLine: function (connection) {
    },
    onRemoveConnection: function () {
      this.showConnectionEditor = false
      this.removeConnection(this.selectedConnection)
    },
    onMouseoverConnection: function (event, connection) {
      this.conEditorTime = new Date().getMilliseconds()
      this.showConnectionEditor = true
      window.setInterval(this.checkTimeoutConEditor, 200)
      this.conEditorLeft = event.clientX + 'px'
      this.conEditorTop = this.offsetY() + event.clientY + 'px'
    },
    onClickConnection: function (event, connection) {
      this.showConnectionEditor = true
      this.selectedConnection = connection
      this.conEditorLeft = event.clientX + 'px'
      this.conEditorTop = this.offsetY() + event.clientY + 'px'
    },
    onMouseoutConnection: function (event, connection) {
      let now = new Date().getMilliseconds()
      if (now - this.conEditorTime > 1000) {
        this.showConnectionEditor = false
      }
      // let middleX = connection.p1.x + (connection.p1.x - connection.p2.x)/2.0
      // this.conEditorLeft = event.clientX + 'px'
      // this.conEditorTop = this.offsetY() + event.clientY + 'px'
    },
    checkTimeoutConEditor: function () {
      let now = new Date().getMilliseconds()
      if (now - this.conEditorTime > 300) {
        this.showConnectionEditor = false
        window.clearInterval()
      }
    },
    onScroll: function (event) {
      // if (event.pageY >= this.lastScroll && (window.document.body.scrollHeight === window.scrollY + window.innerHeight)) {
      //   this.changeHeight(25)
      // }

      this.lastScroll = event.pageY
    },
    onDownloadPad: function () {
      let element = document.createElement('a')
      let padConfig = localStorage.getItem('vuex')
      element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(padConfig))
      element.setAttribute('download', 'pad-config.json')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    ...mapMutations([
      'setBoard', 'addSquare', 'setSquares', 'removeSquare', 'saveSquares', 'addConnection', 'setConnections', 'setHeight', 'changeHeight', 'setWidth', 'removeConnection'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.squares {

  .board {
    background-color: #cfebff;
    width: 100%;
    top: 0;
    bottom: 0;
    height: 100%;
    left: 0;
    z-index: 10;
    position: absolute;
    width: 100%;
    vertical-align: top;
    transition: transform 0.5s;
  }
}

.cover {
  display: flex;
  position: absolute;
  z-index: 15;
  top:0;
  left:0;
  bottom:0;
  right: 0;
  width: 100%;
  padding-top: 20px;
  justify-content: center;
}

.square-editor {
  visibility: hidden;
  opacity: 0;
  transition: z-index 0.3s, visibility 0.3s, opacity 0.3s linear;
  min-height: 50%;
  width: 90%;
  max-height: 90%;
  padding: 20px;
  background-color: white;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.square-border {
  position: absolute;
  min-width: 200px;
  z-index: 15;
  display: flex;
  align-items: left;
}

.connection {
   border: 1px solid black;
   position: absolute;
}

.connection-editor {
  position: absolute;
}

.toolbar {
  position: fixed;
  z-index: 11;
  margin: 20px;
}

.el-dialog__wrapper {
  z-index: 10;
}

.el-dropdown-menu__item {
  display: block;
}

.backgroundScreen {
   position: absolute;
   width: 100%;
   height: 100%;
   left:0;
   top:0;
}

.sidebar-menu {
  z-index: 25;

  &.el-menu--collapse {
  }
}

.actions {
  width: 100%;

  .action {
    &.right {
      float: right;
    }
  }
}

</style>
