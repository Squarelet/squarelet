<template>
  <draggable-resizable @activated="onActivated" @deactivated="showActions = false" class="note" :x="x" :y="y" :w="width" :h="height" v-on:dragging="onDrag" v-on:resizing="onResize" :parent="true">
    <el-card :body-style="{ height: '100%', 'background-color': color }" class="note">
      <el-row class="actions">
        <el-button v-if="showActions && !editing" @click="editing = !editing" type="primary" icon="el-icon-edit" circle></el-button>
        <el-button v-if="showActions && editing"  @click="editing = !editing" type="success" icon="el-icon-success" circle></el-button>
        <el-button v-if="showActions"  @click="onConnect" type="success" icon="el-icon-share" circle></el-button>
        <el-button v-if="showActions && !editing"  @click="removeSquare(idx)" type="danger" icon="el-icon-delete" circle></el-button>
        <el-button :style="{'background-color': this.color, 'border-color': 'rgba(0,0,0,0.3)'}" v-if="showActions && !editing"  @click="selectColor()" type="success" icon="el-icon-edit" circle></el-button>
      </el-row>
      <el-row>
      <div v-if="!editing" v-html="html"></div>
      <markdown-editor  v-if="editing" :id="'contentEditor-' + idx" :class="{'is-editing': editing}" v-model="text" :height="300" :zIndex="20"></markdown-editor>
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
  props: { itext: String, iwidth: Number, iheight: Number, ix: Number, iy: Number, iidx: String, icolor: String },
  components: { DraggableResizable, MarkdownEditor, sketch },
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
      this.updateSquare(this)
    },
    onDrag: function (x, y) {
      this.x = x
      this.y = y
      this.updateSquare(this)
      this.$emit('squaresMoved')
    },
    onSelectColor: function (event) {
      this.setEditorState('colorSelect')
      console.log('COLOR SELECT')
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
