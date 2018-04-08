<template>
  <div class="home">
    <SquareBoard/>
  </div>
</template>

<script>
// @ is an alias to /src
import SquareBoard from '@/components/Board.vue'

export default {
  name: 'Squares',
  components: {
    SquareBoard
  }
}
</script>
