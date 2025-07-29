import { Gem } from '../scripts/models/gem'
import { getNextRand } from './helpers';

export function createGems(size) {
  let x = 0,
    y = 0;
  return Array.from({ length: size * size }, (e, i) => {
    if (x === size) {
      x = 0;
      y++;
    }
    const gem = new Gem(x, y, getNextRand(1, 5));
    x++;
    return gem;
  });
}

