<template>
  <draggable-resizable @activated="onActivated" @deactivated="showActions = false" class="note" :zoom="zoom" :x="x" :y="y" :w="width" :h="height" v-on:dragging="onDrag" v-on:resizing="onResize" :parent="true">
  <el-card :body-style="{ height: '100%', 'background-color': color, 'overflow-y': 'auto'}" class="note">
      <el-row>
      <div v-html="html"></div>
      </el-row>
    </el-card>
  </draggable-resizable>
</template>

<script>

import MarkdownEditor from './MarkdownEditor'
import sketch from 'vue-color'
import DraggableResizable from './Draggable'
import { Converter } from 'showdown'
import 'element-ui/lib/theme-chalk/index.css';
import { mapGetters, mapMutations  } from 'vuex'

export default {
  props: { zoom: Number, itext: String, iwidth: Number, iheight: Number, ix: Number, iy: Number, iidx: String, icolor: String },
  components: { DraggableResizable, MarkdownEditor, sketch},
  data: function () {
    return {
      width: this.iwidth,
      height: this.iheight,
      x: this.ix,
      y: this.iy,
      text: this.itext,
      color: (this.icolor)?this.icolor:'#fff',
      idx: this.iidx,
      showActions: false,
      editing: false,
      predefineColors: [
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585'
      ]
    }
  },
  beforeMount: function () {
    this.converter = new Converter()
  },
  computed: {
    html: function () {
      return this.converter.makeHtml(this.text)
    }
  },
  methods: {
    onActivated: function () {
      this.showActions = true
      this.$emit('activated', this.idx)
      this.setEditorState('editing')
    },
    onConnect: function () {
      this.$emit('startConnect', this.idx)
    },
    onResize: function (x, y, width, height) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
      this.updateSquare(this._data)
    },
    onDrag: function (x, y) {
      this.x = x
      this.y = y
      this.updateSquare(this._data)
      this.$emit('squaresMoved')
    },
    onSelectColor: function (event) {
      this.setEditorState('colorSelect')
    },
    onSelectedColor: function (event) {
      this.setEditorState('default')
    },
    ...mapMutations([
      'updateSquare', 'removeSquare', 'setEditorState'
    ])
  }
}

</script>

<style scoped lang="scss">

.actions {
  position: absolute;
  margin-top: -50px;
  min-width: 300px;
}

.is-editing {
  display: block !important;
}

.square-editor {
   display: none;
   height: 80%;
   width: 98%;
}

.note {
   height: 100%;
   background-color: rgba(0,0,0,0);

   .el-card__body {
     height: 100% !important;
     overflow: scroll;
   }

   text-align: left;
}

.editor-toolbar {
  background: white;
  opacity: 1;
  &:hover {
    opacity: 1;
    background: white;
  }
}

</style>
