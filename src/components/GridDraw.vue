<script setup>
import { colorByNum } from '../scripts/helpers';

// import { defineProps } from 'vue'

defineEmits(['onGemClick', 'onGemMove'])

defineProps({
  gems: {
    type: Array,
    default: []
  },
  selected: {
    type: Object
  },
  gridStyle: {
    type: Object,
  }
})

</script>

<template>
  <div class="gems" :style="gridStyle">
    <div 
      class="gem" 
      v-for="(gem, index) in gems" :key="{ x: gem.x, y: gem.y }"
      :class="{ 
        'selected': selected?.x === gem.x && selected?.y === gem.y,
        [colorByNum(gem.type)]: true
      }"
      @click="$emit('onGemClick', { gem })"
      @touchmove="$emit('onGemMove', { gem })"
    >
      {{ gem.x }}/{{ gem.y }}[{{ gem.type }}]
    </div>
  </div>
</template>
