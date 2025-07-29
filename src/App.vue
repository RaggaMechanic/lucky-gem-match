<script setup>
import { useGame } from './scripts/use-game'
import GridDraw from './components/GridDraw.vue'

const {     
  newGame,
  onClick,
  gridStyle,
  selected,
  points,
  rgems
} = useGame(8)

function openLeaderBoard() {

}
</script>

<template>
  <div>
    <grid-draw 
      :gems="rgems" 
      :gridStyle="gridStyle" 
      :selected="selected"
      @onGemClick="onClick"
    >
    </grid-draw>

    <div class="use-panel">
      <button @click="newGame">New Game</button>
      <button @click="openLeaderBoard">Points: {{ points }}</button>
    </div>
    
  </div>
</template>

<style scoped>
.use-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
