export async function wait(time = 0) {
  return new Promise((res) => setTimeout(res, time));
}

export function colorByNum(num) {
  switch (num) {
    case 1:
      return "gem-red";
    case 2:
      return "gem-green";
    case 3:
      return "gem-blue";
    case 4:
      return "gem-purple";
    case 5:
      return "gem-pink";
    default:
      return "gem-empty";
  }
}

export function getNextRand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function fillGems(gems) {
  const _gems = Object.assign([], gems);
  _gems.forEach((g) => {
    if (g.type === 0) g.type = getNextRand(1, 5);
  });
  return _gems;
}


export function clearMatches(gems, size) {
  const matches = matchLines(gems, size);
  if (matches.length > 0) {
    const newGems = Object.assign([], gems);
    matches.flat().forEach((m, i) => {
      const gem = newGems.find((g) => g.x === m.x && g.y === m.y);
      if (gem) gem.type = 0; // getNextRand(1, 5)
    });
    return { needUpdate: true, newGems, matches };
  }

  return { needUpdate: false, newGems: gems };
}

export function swapElements(gem, selected, gems) {
  console.log(gem, selected);

  const difX = Math.abs(gem.x - selected.x) === 1 && gem.y === selected.y;
  const difY = Math.abs(gem.y - selected.y) === 1 && gem.x === selected.x;

  if (difX || difY) {
    const from = gems.find((g) => g.x === selected.x && g.y === selected.y);
    const to = gems.find((g) => g.x === gem.x && g.y === gem.y);
    const old = from.type;
    from.type = to.type;
    gem.type = old;
    return true;
  }

  return false;
}

function separateGems(gems, size) {
  let lines = [],
    cols = [];
  for (let i = 0; i < size; i++) {
    cols.push(gems.filter((g) => g.x === i));
    lines.push(gems.filter((g) => g.y === i));
  }
  return { lines, cols };
}

// simple
function matchLines(gems, size) {
  const matches = [];
  const { lines, cols } = separateGems(gems, size);
  const all = lines.concat(cols);

  all.forEach((line) => {
    let match = [];
    line.forEach((gem, i) => {
      const someType = (match[match.length - 1] || {}).type === gem.type;
      const last = i === line.length - 1;

      if (gem.type === 0) {
        if (match.length > 2) {
          matches.push(match);
        }
        match = [];
        return;
      }

      if (match.length === 0) {
        match = [gem];
        return;
      }

      if (someType) {
        match.push(gem);
      } else if (match.length > 2) {
        matches.push(match);
        match = [gem];
      } else {
        match = [gem];
      }

      if (match.length > 2 && last) {
        matches.push(match);
      }
    });
  });

  return matches;
}

export function getSwaps(gems, size) {
  const _gems = Object.assign([], gems);
  const { cols } = separateGems(_gems, size);

  const canDrop = (col) => {
    const firstGemIndex = col.findIndex((g) => g.type !== 0);
    const holeAfterGemIndex = col.findLastIndex(
      (g, i) => g.type === 0 && i > firstGemIndex
    );
    console.log(
      "holes",
      col.filter((g) => g.type === 0)
    );
    console.log(firstGemIndex, holeAfterGemIndex);
    return firstGemIndex > -1 && holeAfterGemIndex > -1;
  };

  const swaps = [];
  cols.forEach((col) => {
    console.log(col, canDrop(col));
    while (canDrop(col)) {
      const lastHoleIndex = col.findLastIndex((g) => g.type === 0);
      const gemBeforeHoleIndex = col.findLastIndex(
        (g, i) => g.type !== 0 && i < lastHoleIndex
      );
      const hole = col[lastHoleIndex];
      const gem = col[gemBeforeHoleIndex];
      const swap = {
        from: { x: gem.x, y: gem.y, type: gem.type },
        to: { x: hole.x, y: hole.y, type: hole.type }
      };
      hole.type = swap.from.type;
      gem.type = swap.to.type;
      console.log("swap", swap);
      swaps.push(swap);
    }
  });
  return swaps;
}

