<template>
      <el-dialog
        title="Board Manager"
        :visible="visible"
        :modal="false"
        width="30%">
        <p/>
        <ul>
          <router-link tag="li" v-for="boardId of boards" :to="`/b/${boardId}`">{{boardId}}</router-link>
        </ul>
        <el-form>
          <el-form-item label="Board Name">
            <el-input v-model="boardName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="$emit('close')">Cancel</el-button>
          <el-button type="primary" @click="newBoard()">Create</el-button>
        </span>
      </el-dialog>
</template>

<script>

import axios from 'axios'
import { mapGetters, mapMutations  } from 'vuex'

export default {
  name: 'BoardManager',
  props: ['visible'],
  data () {
    return {
      boardName: '',
      isopen: this.visible,
    }
  },
  computed: {
    ...mapGetters([
      'allSquares', 'allConnections', 'height', 'width', 'board', 'boardString', 'state', 'boards'
    ])
  },
  methods: {
    newBoard: function () {
      if (this.boardName !== '') {
        this.$emit('newBoard', this.boardName)
        this.$emit('close')
      }
    }
  }
}

</script>

<style scoped lang="scss">

</style>
