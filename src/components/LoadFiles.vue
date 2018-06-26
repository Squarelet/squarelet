<template>
      <el-dialog
        title="Load file"
        :visible="visible"
        :modal="false"
        width="30%">
        <p/>
        <el-form>
          <el-form-item  label="URL">
            <el-input v-model="url"></el-input>
          </el-form-item>
          <input type="file" @change="onFileChange">
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="$emit('close')">Cancel</el-button>
          <el-button type="primary" @click="downloadAndUpdate">Upload</el-button>
        </span>
      </el-dialog>
</template>

<script>

import axios from 'axios'

export default {
  name: 'LoadFile',
  props: ['visible'],
  data () {
    return {
      url: '',
      isopen: this.visible,
      loadedFile:''
    }
  },
  methods: {
    onFileChange: function (e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.loadState(files[0]);
    },
    loadState: function (file) {
      var reader = new FileReader()
      reader.onload = (e) => {
        this.loadedFile = JSON.parse(e.target.result)
      }
      reader.readAsText(file)
    },
    downloadAndUpdate: function () {
      if (this.url !== '') {
        axios.get(this.url).then((r) => {
          this.loadedFile = r.data
          this.updateState()
        })
      } else {
        this.updateState()
      }
    },
    updateState: function () {
      this.$store.replaceState(this.loadedFile)
      this.$nextTick(() => {
        this.$emit('updatedState')
        this.$emit('close')
      })
    }
  }
}

</script>

<style scoped lang="scss">

</style>
