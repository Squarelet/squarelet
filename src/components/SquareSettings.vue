<template>
      <el-dialog
        title="Square Settings"
        :visible="visible"
        :modal="false"
        width="30%">
        <p/>
        <el-form>
          <el-form-item label="Square type">
            <el-select @change="onChangeType" v-model="square.type">
              <el-option label="Markdown" value="markdown"></el-option>
              <el-option label="Image" value="image"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="square.type === 'image'">
            <el-input v-model="square.imageURL" @change="onChangeImageURL"></el-input>
          </el-form-item>
          <el-form-item label="Square color">
            <el-color-picker
              v-model="square.color"
              show-alpha
              @active-change="onChangeColor"
              >
            </el-color-picker>
          </el-form-item>
          <el-form-item label="Text color">
            <el-color-picker
              v-model="square.textColor"
              show-alpha
              @active-change="onChangeTextColor"
              >
            </el-color-picker>
          </el-form-item>
          <el-form-item label="Text size">
            <el-input-number v-model="square.textSize" @change="onChangeTextSize" :min="10" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="Border size">
            <el-input-number v-model="square.borderSize" @change="onChangeBorderSize" :min="0" :max="20"></el-input-number>
          </el-form-item>
          <el-form-item label="Border color">
            <el-color-picker
              v-model="square.borderColor"
              show-alpha
              @active-change="onChangeBorderColor"
              >
            </el-color-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="$emit('squareSettingsClose')" type="primary" >Ok</el-button>
        </span>
      </el-dialog>
</template>

<script>

export default {
  name: 'SquareSettings',
  props: ['visible', 'square'],
  data () {
    return {
      isopen: this.visible,
    }
  },
  methods: {
    onChangeType: function (type) {
      this.square.type = type
    },
    onChangeColor: function (color) {
      this.square.color = color
    },
    onChangeTextColor: function (color) {
      this.square.textColor = color
    },
    onChangeTextSize: function (color) {
      this.square.textSize = color
    },
    onChangeBorderSize: function (size) {
      this.square.borderSize = size
    },
    onChangeBorderColor: function (color) {
      this.square.borderColor = color
    },
    onChangeImageURL: function (url) {
      this.square.imageURL = url
    }
  }
}

</script>

<style scoped lang="scss">

</style>
