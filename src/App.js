import React, {Component} from 'react'
import './App.css'
import {evolve, getNeighbours, universe} from 'conway-game-of-life-js'
import moment from 'moment'
import {assocPath, contains, map, range} from 'ramda'

const DELAY = 0
const CYCLES = 1000

const getCellStyle = (perc, alive) => ({
  height: 0,
  paddingBottom: `${perc}%`,
  width: `${perc}%`,
  border: "1px solid black",
  margin: "-1px",
  backgroundColor: alive && "#4CAF50",
  transition: `all ${DELAY / 4000}s ease-in-out`
})

class Cell extends Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return nextProps.alive !== this.props.alive
  }

  render() {
    const {alive, position, size} = this.props
    const [x, y] = position
    const [width, height] = size
    const perc = 100 / width
    return (
      <div
        key={`${x}-${y}`}
        className={`Cell-${x}-${y}`}
        style={getCellStyle(perc, alive)}>
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
                    neighbours={getNeighbours([x, y], this.props.universe)}
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
      universe,
      benchmark: {
        result: undefined
      },
      iterations: 0,
      iterationsMessage: ''
    }
  }

  onClickEvolve = () => {
    this.setState((state) => ({
      ...state,
      universe: evolve(state.universe),
      iterations: state.iterations + 1
    }))
  }

  onClickBenchmark = () => {
    const start = moment()
    for (let n = 0; n < CYCLES; n++) {
      this.onClickEvolve()
    }
    this.setState((state) => {
      const end = moment()
      return assocPath(['benchmark', 'result'], end.diff(start, 'milliseconds'), state)
    })
  }

  autoBenchmark = (state) => (
    this.setState((state) => ({
      ...state,
      iterations: 0,
      iterationsMessage: `${state.iterations} iterations/second`
    })))

  onToggleAutoEvolve = () => {
    this.setState((state) => {
      const {autoEvolveId, benchmarkLoggerId} = state
      return {
        ...state,
        autoEvolveId: autoEvolveId
          ? clearInterval(autoEvolveId)
          : setInterval(() => this.onClickEvolve(), DELAY),
        benchmarkLoggerId: benchmarkLoggerId
          ? clearInterval(benchmarkLoggerId)
          : setInterval(() => this.autoBenchmark(), 1000)
      }
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-title">Game of Life</div>
        <div className="App-intro">
          <Universe universe={this.state.universe}/>
        </div>
        {!this.state.autoEvolveId &&
        <button onClick={this.onClickEvolve}>Evolve</button>
        }
        <button onClick={this.onToggleAutoEvolve}>
          {this.state.autoEvolveId ? "Stop" : "Auto"}
        </button>
        {this.state.iterationsMessage
        && <div>Result: {`${this.state.iterationsMessage || ''}`}</div>}
        <button onClick={this.onClickBenchmark}>Benchmark</button>
        {this.state.benchmark.result
        && <div>Result: {`${this.state.benchmark.result || ''}ms`}</div>}
      </div>
    )
  }
}

export default App
