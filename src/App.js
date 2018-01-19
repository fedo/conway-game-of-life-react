import moment from 'moment'
import React, {Component} from 'react'
import {assocPath} from 'ramda'

import {GameOfLife} from 'conway-game-of-life-js'
import Universe from './components/Universe'

import './App.css'

const DELAY = 0
const CYCLES = 1000

class App extends Component {
  constructor(props) {
    super(props)
    const engine = new GameOfLife('JSFIDDLE')
    const universe = engine.view(engine.create([15, 15], {random: true}))
    this.engine = engine
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
    const {size, cells} = this.state.universe
    this.setState((state) => ({
      ...state,
      universe: this.engine.view(this.engine.evolve(this.engine.create(size, {cells}))),
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
          <Universe
            universe={this.state.universe}
          />
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
