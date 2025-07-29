import { ref, computed, onMounted } from 'vue'
import { createGems } from './factory'
import { wait, clearMatches, getSwaps, fillGems, swapElements } from './helpers'

export function useGame(size) {
  const gems = ref([])
  const points = ref(0)
  const selected = ref(null)
  const isAnimated = ref(false)

  const selectedGem = computed(() => selected.value)
  const rgems = computed(() => gems.value)

  const newGame = () => {
    console.log("Start init new game")
    const nGems = createGems(size)
    gems.value = nGems
    updateGems(gems.value, size)
      .then(r => console.log('Initial update end'));
  };

  const dropGems = (ingems) => {
    const swaps = getSwaps(ingems, size)
    swaps.forEach((s) => {
      const _gems = Object.assign([], ingems);
      const gem = _gems.find((g) => g.x === s.from.x && g.y === s.from.y)
      const hole = _gems.find((g) => g.x === s.to.x && g.y === s.to.y)
      gem.type = s.to.type
      hole.type = s.from.type
      gems.value = _gems
    })
  }

  const updateGems = async (_gems, size) => {
    const { needUpdate, newGems, matches } = clearMatches(_gems, size)
    if (needUpdate) {
      isAnimated.value = true

      await wait(250);
      dropGems(newGems);

      await wait(250);
      fillGems(newGems);

      await wait(250);
      gems.value = newGems;
      points.value = matches
        .map((m) => m.length * m[0].type * 10)
        .reduce((c, n) => c + n, points.value)
        
      await wait(250);
      await updateGems(_gems, size);
    } else {
      isAnimated.value = false
    }
  };

  const onClick = async ({ gem }) => {
    const isEmpty = gem?.type === 0
    const isSelected = gem?.x === selected.value?.x && gem?.y === selected.value?.y
    if (isEmpty || isSelected || isAnimated.value === true) return

    const _gems = Object.assign([], gems.value)
    if (selected.value != null && swapElements(gem, selected.value, _gems)) {
      selected.value = null
      gems.value = _gems
      
      await wait(250)
      updateGems(gems.value, size)
      return
    }

    selected.value = gem
  };
  
  onMounted(() => {
    wait(300).then(() => newGame())
  })

  const style = {
    gridTemplateColumns: `repeat(${size}, 50px)`,
    gridTemplateRows: `repeat(${size}, 50px)`
  }

  return {
    newGame,
    onClick,
    rgems,
    gridStyle: style,
    selected: selectedGem,
    points: computed(() => points.value)
  }
}