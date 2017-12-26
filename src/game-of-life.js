import {range, reduce, equals} from 'ramda'

const universe = {
  size: [10, 10],
  cells: [
    [0, 0], [4, 4], [6, 6], [9, 9]
  ]
}

const evolve = (universe) => {
  const {size, cells} = universe
  return {
    size,
    cells: []
  }
}

const getNeighbours = (position, universe) => {
  const {size, cells} = universe
  const [width, height] = size
  const [x, y] = position
  const xs = range(x - 1, x + 2)
  const ys = range(y - 1, y + 2)
  return reduce((acc, x) => {
    if (x >= 0 && x < width) {
      return reduce((acc2, y) => {
        if (equals(position, [x, y])) {
          return acc2
        } else if (y >= 0 && y < height) {
          return [...acc2, [x, y]]
        } else {
          return acc2
        }
      }, acc, ys)
    } else {
      return acc
    }
  }, [], xs)
}

export {
  evolve,
  getNeighbours,
  universe
}