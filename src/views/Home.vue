<template>
  <div class="home" :style="{'background-color': bgcolor}">
    <SquareBoard v-if="show && iboardId" :sharedPad="sharedPad" :iboardId="iboardId" :startPad="startPad"/>
  </div> 
</template>

<script>
// @ is an alias to /src
import 'font-awesome/css/font-awesome.min.css'
import 'simplemde/dist/simplemde.min.css'
import SquareBoard from '@/components/Board.vue'
import { mapGetters, mapMutations  } from 'vuex'

export default {
  name: 'Squares',
  props: ['startPad', 'iboardId', 'sharedPad'],
  data: function () {
    return {
      show: false
    }
  },
  components: {
    SquareBoard
  },
  created () {
    if (!this.$store._vm.$root.$data['vue-persist-patch-delay']) {
      this.show = true
    }
    this.$store._vm.$root.$on('storageReady', () => {
      this.show = true
      this.$store._vm.$root.$data['vue-persist-patch-delay'] = false
    });
  },
  computed: {
    ...mapGetters(['bgcolor'])
  }
}
</script>

<style>
  .home {
    position: absolute;
    top: 0;
    bottom: 0;
    min-height: 100%;
    min-width: 100%;
  }

</style>
