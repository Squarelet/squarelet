<template>
  <draggable-resizable @dblClickSquare="$emit('dblClickSquare', $event)" @touchright="$emit('touchright')" @activated="onActivated" @deactivated="showActions = false" class="note" :zoom="zoom" :x="x" :y="y" :w="width" :h="height" v-on:dragging="onDrag" v-on:resizing="onResize" :parent="true">
  <el-card v-if="type === 'markdown'" :class="{'isDark': isDark}" :style="{'border': border}" :body-style="{ height: '100%', color: textColor, 'background-color': color, 'font-size': textSizePx, 'overflow-y': 'auto'}" class="note">
      <el-row>
      <div v-html="html"></div>
      </el-row>
  </el-card>
  <el-card v-else-if="type === 'image'" :class="{'isDark': isDark}"  :style="{'border': border}" :body-style="{ height: '100%', 'background-color': 'rgba(0,0,0,0)', 'overflow-y': 'auto', 'padding': 0}" class="note image">
    <img :src="imageURL">
  </el-card>
  <el-card v-else-if="type === 'website'" :class="{'isDark': isDark}"  :style="{'border': border}" :body-style="{ height: '100%', 'background-color': 'rgba(0,0,0,0)', 'overflow-y': 'auto', 'padding': 0}" class="note website">
    <iframe scroll="true" :width="width" :height="height" :src="websiteURL"></iframe>
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
  props: { zoom: Number, itype: String, itext: String, iwidth: Number, iheight: Number, ix: Number, iy: Number, iidx: String, icolor: String, itextcolor: String, itextsize:Number, izIndex: Number, isDark: Boolean, isquare: Object },
  components: { DraggableResizable, MarkdownEditor, sketch},
  data: function () {
    return {
      square: this.isquare,
      width: this.iwidth,
      height: this.iheight,
      x: this.ix,
      y: this.iy,
      zIndex: this.izIndex,
      text: this.itext,
      imageURL: (this.isquare.imageURL)?this.isquare.imageURL:'',
      websiteURL: (this.isquare.websiteURL)?this.isquare.websiteURL:'',
      color: (this.icolor)?this.icolor:'#fff',
      borderSize: (this.isquare.borderSize)?this.isquare.borderSize:1,
      borderColor: (this.isquare.borderColor)?this.isquare.borderColor:'#fff',
      textColor: (this.itextcolor)?this.itextcolor:'#000',
      textSize: (this.itextsize)?this.itextsize:16,
      idx: this.iidx,
      showActions: false,
      editing: false,
      type: (this.itype)?this.itype:'markdown',
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
    },
    textSizePx: function () {
      return this.textSize + 'px'
    },
    border: function () {
      return this.borderSize + 'px solid ' + this.borderColor
    },
    squareOpacity: function () {
      if (this.isDark) {
        return '0.5'
      } else {
        return '1'
      }
    }
  },
  methods: {
    onActivated: function () {
      this.showActions = true
      this.$emit('activated', this)
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

   &.isDark:hover {
    opacity: 0.6;
   }

   &.website {
    padding: 20px;
    background-color: white;
   }

   &.image {
    padding: 0;
    img {
      width: 100%;
    }

    .el-card__body {
      height: 100% !important;
      padding: 0;
    }

   }

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
