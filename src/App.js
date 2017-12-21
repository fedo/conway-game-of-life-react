import React, {Component} from 'react'
import logo from './logo.svg'
import './App.css'
import {universe} from './game-of-life'
import {map, range, reduce, unnest} from 'ramda'

const getCellStyle = (x, y, width, height) => ({
  display: "flex-cell"
  // flex: `${(100/width)*100}%`
})

class Cell extends Component {
  render() {
    const [x, y] = this.props.position
    const [width, height] = this.props.size
    const perc = 100 / width
    return (
      <div
        className={`Cell-${x}-${y}`}
        style={{
          height: 0,
          paddingBottom: `${perc}%`,
          width: `${perc}%`,
          border: "1px solid black",
          margin: "-1px",
        }}>
        [{x}-{y}]
      </div>
    )
  }
}

const UniverseStyle = {
  display: "flex",
  flexFlow: "row wrap",
  width: "100%",
  backgroundColor: "#EEEEEE"
}

class Universe extends Component {
  render() {
    const [width, height] = this.props.universe.size
    const {cells, size} = this.props.universe
    const allCells = map((x) => {
      console.log(x)
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
                  return <Cell key={`${x}-${y}`} position={[x, y]} size={size}/>
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
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <Universe universe={universe}/>
        </div>
      </div>
    )
  }
}

export default App
