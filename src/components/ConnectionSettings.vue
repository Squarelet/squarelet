<template>
      <el-dialog
        title="Connection Settings"
        :visible.sync="visible"
        :modal="false"
        width="30%">
        <p/>
        <el-form>
         <el-form-item label="Connection color">
            <el-color-picker
              v-model="connection.color"
              show-alpha
              @active-change="onChangeColor"
              >
            </el-color-picker>
          </el-form-item>
         <el-form-item label="Width">
            <el-input-number v-model="connection.width" @change="onChangeWidth" :min="0" :max="20"></el-input-number>
         </el-form-item>
         <el-form-item label="Dashed">
            <el-checkbox v-model="connection.dashed" @change="onChangeDashed"></el-checkbox>
         </el-form-item>
         <el-form-item label="Dash size">
            <el-input-number v-model="connection.dashedA" @change="onChangeDashSize" :min="0" :max="20"></el-input-number>
         </el-form-item>
          <el-form-item label="Dash space size">
            <el-input-number v-model="connection.dashedB" @change="onChangeDashSpaceSize" :min="0" :max="20"></el-input-number>
         </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="$emit('connectionSettingsClose')" type="primary" >Ok</el-button>
        </span>
      </el-dialog>
</template>

<script>

export default {
  name: 'ConnectionSettings',
  props: ['visible', 'connection'],
  data () {
    return {
      isopen: this.visible,
    }
  },
  methods: {
    onChangeColor: function (color) {
      this.connection.color = color
    },
    onChangeWidth: function (size) {
      this.connection.width = size
    },
    onChangeDashed: function (isDashed) {
      this.connection.dashed = isDashed
    },
    onChangeDashSize: function (size) {
      this.connection.dashedA = size
    },
    onChangeDashSpaceSize: function (size) {
      this.connection.dashedB = size
    }
  }
}

</script>

<style scoped lang="scss">

</style>
