<template>
  <vue-draggable-resizable @activated="onActivated" @deactivated="showActions = false" class="note" :x="x" :y="y" :w="width" :h="height" v-on:dragging="onDrag" v-on:resizing="onResize" :parent="true">
    <el-card :body-style="{ height: '100%' }" class="note">
      <el-row class="actions">
        <el-button v-if="showActions && !editing" @click="editing = !editing" type="primary" icon="el-icon-edit" circle></el-button>
        <el-button v-if="showActions && editing"  @click="editing = !editing" type="success" icon="el-icon-success" circle></el-button>
        <el-button v-if="showActions"  @click="onConnect" type="success" icon="el-icon-share" circle></el-button>
        <el-button v-if="showActions && !editing"  @click="removeSquare(idx)" type="danger" icon="el-icon-delete" circle></el-button>
      </el-row>
      <div v-if="!editing" v-html="text"></div>
      <textarea class="square-editor" :class="{'is-editing': editing}" v-model="text">{{text}}</textarea>
    </el-card>
  </vue-draggable-resizable>
</template>

<script>

import VueDraggableResizable from 'vue-draggable-resizable'
import 'element-ui/lib/theme-chalk/index.css';
import { mapGetters, mapMutations  } from 'vuex'

export default {
  props: { itext: String, iwidth: Number, iheight: Number, ix: Number, iy: Number, iidx: String},
  components: { VueDraggableResizable },
  data: function () {
    return {
      width: this.iwidth,
      height: this.iheight,
      x: this.ix,
      y: this.iy,
      text: this.itext,
      idx: this.iidx,
      showActions: false,
      editing: false
    }
  },
  beforeMounted: function () {
    this.x = this.ix
    this.y = this.iy
    this.width = this.iwidth
    this.height = this.iheight
  },
  methods: {
    onActivated: function () {
      this.showActions = true
      this.$emit('activated', this.idx)
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
    ...mapMutations([
      'updateSquare', 'removeSquare'
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
   height: 100%;
   width: 98%;
}

.note {
   height: 100%;

   .el-card__body {
     height: 100% !important;
   }
}

</style>
