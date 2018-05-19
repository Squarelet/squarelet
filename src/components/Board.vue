<template>
  <div class="squares" :style="{'max-height': `${height}px`}">
    <div class="toolbar">
    <el-button @click="addSquare({x:20, y: offsetY() + 80, text: '', width: 200, height: 200, idx: Math.random().toString(36).substring(2)})" type="primary" icon="el-icon-circle-plus">Add</el-button>
    <el-button @click="saveSquares()" type="primary" icon="el-icon-check">Save</el-button>
    </div>
    <div class="board" :style="{'height': `${height}px`, 'width': `${width}px`, 'transform-origin': '0 0', 'transform': `scale(${zoom})`}">
      <svg preserveAspectRatio="xMidYMid meet" :viewBox="`0 0 ${width} ${height}`" class="backgroundScreen">
        <line :x1="c.p1.x + c.p1.width" :y1="c.p1.y + c.p1.height/2.0" :x2="c.p2.x" :y2="c.p2.y + c.p2.height/2.0" v-for="(c,index) in allConnections" :key=index style="stroke:rgb(140, 182, 164);stroke-width:5" />
      </svg>
      <Square @activated="onActivated" @startConnect="onStartConnect" @squaresMoved="createConnections" :zoom="zoom" :itext="s.text" :icolor="s.color" :iidx="s.idx" :ix="s.x" :iy="s.y" :iwidth="s.width" :iheight="s.height" v-for="(s, index) in allSquares" :key="s.idx"></Square>
    </div>
    <div class="square-border" v-for="(s, index) in allSquares" :key="s.idx"
        :style="{'top': `${s.y*zoom - 50}px`, 'left': `${(s.x - 10)*zoom}px`, 'width': `${(s.width + 20)*zoom}px`, 'height': '40px'}">
      <el-row class="actions">
        <el-button @click="openEditor(s)" type="primary" icon="el-icon-edit" circle></el-button>
        <el-button @click="s.onConnect" type="success" icon="el-icon-share" circle></el-button>
        <el-button @click="s.removeSquare(s.idx)" type="danger" icon="el-icon-delete" circle></el-button>
        <el-button :style="{'background-color': s.color, 'border-color': 'rgba(0,0,0,0.3)'}" v-if="s.showActions && !s.editing"  @click="s.selectColor()" type="success" icon="el-icon-edit" circle></el-button>
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
    window.addEventListener('keypress', this.onKeyPress);
    window.addEventListener('scroll', this.onScroll);

    // Load Height
    let h = localStorage.getItem('height')
    if (h) {
      this.setHeight(Number(JSON.parse(h)))
    } else {
      this.setHeight(window.innerHeight)
    }

    // Load width
    let w = localStorage.getItem('width')
    if (w) {
      this.setWidth(Number(JSON.parse(w)))
    } else {
      this.setWidth(window.innerWidth)
    }

    // Load Squares
    let sq = localStorage.getItem('squares')
    if (sq) {
      this.setSquares(JSON.parse(sq))
    } else {
      this.setSquares([])
    }

    this.$nextTick(() => {
      let cs = localStorage.getItem('connections')
      if (cs) {
        cs = JSON.parse(cs)
        console.log(cs)
        let new_cs = []
        for (let i = 0; i < cs.length; ++i) {
           let sq1 = this.allSquares.find(s => s.idx == cs[i].p1.idx)
           let sq2 = this.allSquares.find(s => s.idx == cs[i].p2.idx)

           this.addConnection({p1: sq1, p2: sq2})
        }
      } else {
        this.setConnections([])
      }
    })
  },
  computed: {
    heightN: function () {
      console.log(this.height/this.zoom )
      if (this.height/this.zoom < window.innerHeight) {
        return window.innerHeight + 'px'
      } else {
        return this.height + 'px'
      }
    },
    widthN: function () {
      if (this.height/this.zoom < window.innerHeight) {
        return window.innerHeight + 'px'
      } else {
        return this.width + 'px'
      }
    },
    ...mapGetters([
      'allSquares', 'allConnections', 'height', 'width'
    ])
  },
  methods: {
    openEditor: function (square) {
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
    onStartConnect: function (event) {
      console.log('Conecting', event)
      this.connectionMode = true
      this.connectionTmp.push(event)
    },
    onKeyPress: function (event) {
      if (event.key === 'z') {
         this.changeZoom(0.05)
      } else if (event.key === 'Z') {
         this.changeZoom(-0.05)
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
        let sq1 = this.allSquares.find(s => s.idx == this.connectionTmp[0])
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
      'addSquare', 'setSquares', 'saveSquares', 'addConnection', 'setConnections', 'setHeight', 'changeHeight', 'setWidth'
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
  position: fixed;
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
  max-height: 90%;
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
