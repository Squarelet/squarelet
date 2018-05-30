<template>
  <div class="squares" :style="{'max-height': heightN}">
    <div class="toolbar">
    <el-button @click="addSquare({x:20, y: offsetY() + 80, text: '', width: 200, height: 200, idx: Math.random().toString(36).substring(2)})" type="primary" icon="el-icon-circle-plus">Add</el-button>
    <el-button @click="saveSquares()" type="primary" icon="el-icon-check">Save</el-button>
    </div>
    <div class="board" :style="{'height': heightN, 'width': widthN, 'transform-origin': '0 0', 'transform': `scale(${zoom})`}">
      <svg @dblclick="addSquareOnCursor($event)" preserveAspectRatio="xMidYMid meet" :viewBox="`0 0 ${widthN} ${heightN}`" class="backgroundScreen">
        <line :x1="c.p1.x + c.p1.width" :y1="c.p1.y + c.p1.height/2.0" :x2="c.p2.x" :y2="c.p2.y + c.p2.height/2.0" v-for="(c,index) in allConnections" :key=index style="stroke:rgb(140, 182, 164);stroke-width:5" />
      </svg>
      <Square @activated="onActivated" @squaresMoved="createConnections" :zoom="zoom" :itext="s.text" :icolor="s.color" :iidx="s.idx" :ix="s.x" :iy="s.y" :iwidth="s.width" :iheight="s.height" v-for="(s, index) in allSquares" :key="s.idx"></Square>
    </div>
    <div class="square-border" v-for="(s, index) in allSquares" :key="s.idx"
        :style="{'top': `${s.y*zoom - 50}px`, 'left': `${(s.x - 10)*zoom}px`, 'width': `${(s.width + 20)*zoom}px`, 'height': '40px'}">
      <el-row class="actions" v-if="s.showActions && !s.editing">
        <el-button class="action" @click.stop.prevent="openEditor(s, $event)" type="primary" icon="el-icon-edit" circle></el-button>
        <el-button class="action" @click="onConnect(s)" type="success" icon="el-icon-share" circle></el-button>
        <el-button class="action" @click="removeSquare(s.idx)" type="danger" icon="el-icon-delete" circle></el-button>
        <el-button :style="{'background-color': s.color, 'border-color': 'rgba(0,0,0,0.3)'}"  @click="s.selectColor()" type="success" icon="el-icon-edit" circle></el-button>
      </el-row>
    </div>
    <div class="cover" :style="{'z-index': (showEditor)?'15':'0'}">
      <div class="square-editor" :style="{'opacity': (showEditor)? (editorOpacity): '0', 'visibility': (showEditor)? 'visible' : 'hidden'}">
        <el-button   @click="showEditor = false" type="success" icon="el-icon-save">Save</el-button>
        <el-button   @click="changeEditorOpacity()" type="success">Preview</el-button>
        <markdown-editor v-if="editSquare.editing" :id="'contentEditor-' + editSquare.idx" :class="{'is-editing': editSquare.editing}" v-model="editSquare.text" :height="300" :zIndex="20"></markdown-editor>
      </div>
    </div>
  </div>
</template>

<script>

import MarkdownEditor from './MarkdownEditor'
import Square from './Square'
import { mapGetters, mapMutations  } from 'vuex'

export default {
  name: 'SquareBoard',
  components: { Square, MarkdownEditor },
  props: {
  },
  sockets: {
    'squares': function (data) {
      console.log(data)
//      this.setBoard(data)
    },
  },
  data: function () {
    return {
      editSquare: {},
      editorOpacity: 1,
      zoom: 1,
      controlDown: false,
      connectionMode: false,
      connectionTmp: [],
      heightNum: 0,
      lastScroll: 0,
      showEditor: false
    }
  },
  created () {
    window.addEventListener('keypress', this.onKeyPress)
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.onResize)

    // Load Height
    // let h = localStorage.getItem('height')
    // if (h) {
    //   this.setHeight(Number(JSON.parse(h)))
    // } else {
    //   this.setHeight(window.innerHeight)
    // }

    // // Load width
    // let w = localStorage.getItem('width')
    // if (w) {
    //   this.setWidth(Number(JSON.parse(w)))
    // } else {
    //   this.setWidth(window.innerWidth)
    // }

    // // Load Squares
    // let sq = localStorage.getItem('squares')
    // if (sq) {
    //   this.setSquares(JSON.parse(sq))
    // } else {
    //   this.setSquares([])
    // }

    this.$nextTick(() => {
      let cs = this.allConnections
      if (cs) {
        console.log('all CONECTIONS', cs)
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

      let vuex = localStorage.getItem('vuex')
      this.$socket.emit('update', vuex)
    })


  },
  computed: {
    heightN: function () {
      console.log(this.height, window.innerHeight)
      if (this.height/this.zoom < window.innerHeight) {
        return window.innerHeight + 'px'
      } else {
        return this.height + 'px'
      }
    },
    widthN: function () {
      if (this.width/this.zoom < window.innerWidth) {
        return window.innerWidth + 'px'
      } else {
        return this.width + 'px'
      }
    },
    ...mapGetters([
      'allSquares', 'allConnections', 'height', 'width', 'board', 'boardString'
    ])
  },
  methods: {
    openEditor: function (square, e) {
      console.log(e);
      if (e.stopPropagation) e.stopPropagation()
      if (e.preventDefault) e.preventDefault()

      this.editSquare = square
      this.editSquare.editing = true
      this.showEditor = true
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
    addSquareOnCursor: function (event) {
      console.log('DBCLICK', event)
      this.addSquare({x: this.offsetX() + event.clientX, y: this.offsetY() + event.clientY, text: '', width: 200, height: 200, idx: Math.random().toString(36).substring(2)})
    },
    onConnect: function (square) {
      console.log('Conecting', square)
      this.connectionMode = true
      this.connectionTmp.push(square)
      console.log(square.idx)
    },
    onKeyPress: function (event) {
      if (event.key === 'z') {
         this.changeZoom(0.05)
      } else if (event.key === 'Z') {
         this.changeZoom(-0.05)
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
      let newZoom = this.zoom + inc
      this.zoom = (newZoom >= 0.2) ? newZoom: 0.2
      if (this.zoom < 1) {
        this.setWidth(this.width/this.zoom)
        this.setHeight(this.height/this.zoom)
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
    onScroll: function (event) {
      // if (event.pageY >= this.lastScroll && (window.document.body.scrollHeight === window.scrollY + window.innerHeight)) {
      //   this.changeHeight(25)
      // }

      this.lastScroll = event.pageY
    },
    ...mapMutations([
      'setBoard', 'addSquare', 'setSquares', 'removeSquare', 'saveSquares', 'addConnection', 'setConnections', 'setHeight', 'changeHeight', 'setWidth'
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
    display: inline-block;
    position: absolute;
    width: 100%;
    vertical-align: top;
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
  align-items: center;
  justify-content: center;
}

.square-editor {
  visibility: hidden;
  opacity: 0;
  transition: z-index 0.3s, visibility 0.3s, opacity 0.3s linear;
  min-height: 50%;
  width: 90%;
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
  min-width: 400px;
  z-index: 15;
  display: flex;
  align-items: left;
}

.connection {
   border: 1px solid black;
   position: absolute;
}

.toolbar {
  position: fixed;
  z-index: 11;
  margin: 20px;
}

.backgroundScreen {
   position: absolute;
   width: 100%;
   height: 100%;
   left:0;
   top:0;
}
</style>
