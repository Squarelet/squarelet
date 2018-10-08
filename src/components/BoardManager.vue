<template>
      <el-dialog
        title="Board Manager"
        :visible="visible"
        :modal="false"
        width="30%">
        <p/>
          <el-table
            :data="boards"
            style="width: 100%">
           <el-table-column
              label="Name"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.boardId }}</span>
              </template>
           </el-table-column>

           <el-table-column
              label="Name"
              width="280">
              <template slot-scope="scope">
                <router-link tag="el-button" :to="`/local/${scope.row.boardId}`">Local</router-link>
                <el-button @click="$emit('publishBoard', scope.row.boardId)" v-if="!scope.row.shared">Publish</el-button>
                <router-link tag="el-button" :to="`/shared/${scope.row.boardId}`" v-if="scope.row.shared">Remote</router-link>
              </template>
           </el-table-column>

          </el-table>
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
