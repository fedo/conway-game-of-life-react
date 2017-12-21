import React, {Component} from 'react'
import './App.css'
import {universe} from './game-of-life'
import {map, range, contains} from 'ramda'

const getCellStyle = (perc, alive) => ({
  height: 0,
  paddingBottom: `${perc}%`,
  width: `${perc}%`,
  border: "1px solid black",
  margin: "-1px",
  backgroundColor: alive && "#4CAF50"
})

class Cell extends Component {
  render() {
    const {alive, position, size} = this.props
    const [x, y] = position
    const [width, height] = size
    const perc = 100 / width
    return (
      <div
        className={`Cell-${x}-${y}`}
        style={getCellStyle(perc, alive)}>
        [{x}-{y}]
        <div>
          {alive ? "X" : "-"}
        </div>
      </div>
    )
  }
}

const UniverseStyle = {
  display: "flex",
  flexFlow: "row wrap",
  width: "100%",
  backgroundColor: "#424242"
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
            return (
              <div class={`Row-${row}`} style={UniverseStyle}>
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

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {universe}
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Game of Life</h1>
        </header>
        <div className="App-intro">
          <Universe universe={universe}/>
        </div>
      </div>
    )
  }
}

export default App
