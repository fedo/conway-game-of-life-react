import React, {Component} from 'react'
import './App.css'
import {getNeighbours, universe, evolve, counterMap$} from 'conway-game-of-life-js'
import {map, range, contains} from 'ramda'
import {List} from 'immutable'

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
    const {alive, position, size, neighbours, counterMap} = this.props
    const [x, y] = position
    const [width, height] = size
    const perc = 100 / width
    return (
      <div
        key={`${x}-${y}`}
        className={`Cell-${x}-${y}`}
        style={getCellStyle(perc, alive)}>
        {/*<div>{counterMap.get(List([x, y]))}</div>*/}
      </div>
    )
  }
}

const UniverseStyle = {
  display: "flex",
  flexFlow: "row wrap",
  width: "100%",
  maxWidth: "80vh",
  maxHeight: "80wh",
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
                    neighbours={getNeighbours([x, y], this.props.universe)}
                    // counterMap={counterMap$(this.props.universe)}
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
    this.state = {
      autoEvolveId: undefined,
      universe
    }
  }

  onClickEvolve = () => {
    this.setState((state) => ({
      ...state,
      universe: evolve(state.universe)
    }))
  }

  onToggleAutoEvolve = () => {
    this.setState((state) => {
      const {autoEvolveId} = state
      return {
        ...state,
        autoEvolveId: autoEvolveId
          ? clearInterval(autoEvolveId)
          : setInterval(() => this.onClickEvolve(), 500)
      }
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Game of Life</h1>
        </header>
        <div className="App-intro">
          <Universe universe={this.state.universe}/>
        </div>
        {!this.state.autoEvolveId &&
        <button onClick={this.onClickEvolve}>Evolve</button>
        }
        <button onClick={this.onToggleAutoEvolve}>
          {this.state.autoEvolveId ? "Stop" : "Auto"}
        </button>
      </div>
    )
  }
}

export default App
