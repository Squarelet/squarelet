<template>
      <el-dialog
        title="Load file"
        :visible="visible"
        :modal="false"
        width="30%">
        <p/>
        <el-form>
              <input type="file" @change="onFileChange">
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="$emit('close')">Cancel</el-button>
          <el-button type="primary" @click="updateState">Confirm</el-button>
        </span>
      </el-dialog>
</template>

<script>

export default {
  name: 'LoadFile',
  props: ['visible'],
  data () {
    return {
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
        this.loadedFile = e.target.result
      }
      reader.readAsText(file)
    },
    updateState: function () {
      this.$store.replaceState(JSON.parse(this.loadedFile))
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
