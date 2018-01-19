import {contains, map, range} from 'ramda'
import React, {Component} from 'react'

import Cell from './Cell'

const UniverseStyle = {
  display: "flex",
  flexFlow: "row wrap",
  width: "100%",
  maxWidth: "80vh",
  maxHeight: "80wh",
  backgroundColor: "#424242",
  border: "1px solid black",
  margin: "0 auto"
}

class Universe extends Component {
  render() {
    const [width, height] = this.props.universe.size
    const {cells, size} = this.props.universe
    const allCells = map((x) => {
      return map((y) => {
        return [x, y]
      }, range(0, height))
    }, range(0, width))

    return (
      <div className="Universe" style={UniverseStyle}>
        {
          allCells.map((row) => {
            const rowId = "" + row[0][0]
            return (
              <div
                key={rowId}
                className={`Row-${rowId}`}
                style={UniverseStyle}>
                {row.map(([x, y]) => {
                  const alive = contains([x, y], cells)
                  return <Cell
                    key={`${x}-${y}`}
                    position={[x, y]}
                    size={size}
                    alive={alive}
                  />
                })}
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Universe