<template>
  <div class="home" :style="{'background-color': bgcolor}">
    <SquareBoard/>
  </div>
</template>

<script>
// @ is an alias to /src
import SquareBoard from '@/components/Board.vue'
import { mapGetters, mapMutations  } from 'vuex'

export default {
  name: 'Squares',
  components: {
    SquareBoard
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
