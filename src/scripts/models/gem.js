

export class Gem {
  x = -1;
  y = -1;
  type = 0;
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

export const GemTypes = Object.freeze({
    Red: 0,
    Blue: 1,
    Green: 2,
    Yellow: 3,
})
