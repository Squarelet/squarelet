<template>
  <div class="squares" :style="{height: heightN}">
    <div class="toolbar">
    <el-button @click="addSquare({x:20, y: offsetY() + 80, text: '', width: 200, height: 200, idx: Math.random().toString(36).substring(2)})" type="primary" icon="el-icon-circle-plus">Add</el-button>
    <el-button @click="saveSquares()" type="primary" icon="el-icon-check">Save</el-button>
    </div>
    <div class="board" :style="{height: heightN, width: `${width}%`, 'transform-origin': '0 0', 'transform': `scale(${zoom})`}">
      <svg class="backgroundScreen" :style="{height: heightN, width: `${width}%`}">
        <line :x1="c.p1.x + c.p1.width" :y1="c.p1.y + c.p1.height/2.0" :x2="c.p2.x" :y2="c.p2.y + c.p2.height/2.0" v-for="(c,index) in allConnections" :key=index style="stroke:rgb(140, 182, 164);stroke-width:5" />
      </svg>
      <Square @activated="onActivated" @startConnect="onStartConnect" @squaresMoved="createConnections" :zoom="zoom" :itext="s.text" :icolor="s.color" :iidx="s.idx" :ix="s.x" :iy="s.y" :iwidth="s.width" :iheight="s.height" v-for="(s, index) in allSquares" :key="s.idx"></Square>
    </div>
  </div>
</template>

<script>

import Square from './Square'
import { mapGetters, mapMutations  } from 'vuex'

export default {
  name: 'SquareBoard',
  components: { Square },
  props: {
  },
  data: function () {
    return {
      zoom: 1,
      controlDown: false,
      connectionMode: false,
      connectionTmp: [],
      heightNum: 0,
      lastScroll: 0
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
        console.log(new_cs)

      } else {
        this.setConnections([])
      }
    })
  },
  computed: {
    heightN: function () {
      return this.height + 'px'
    },
    ...mapGetters([
      'allSquares', 'allConnections', 'height', 'width'
    ])
  },
  methods: {
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
      this.zoom += inc
      this.setWidth(this.width/this.zoom)
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
      if (event.pageY >= this.lastScroll && (window.document.body.scrollHeight === window.scrollY + window.innerHeight)) {
        this.changeHeight(25)
      }

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
  width: 100%;
  .board {
    background-color: #cfebff;
    width: 100%;
    top: 0;
    bottom: 0;
    height: 100%;
    z-index: 10;
  }
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
   left:0;
   top:0;
}
</style>
