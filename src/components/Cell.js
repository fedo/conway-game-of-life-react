import React, {Component} from 'react'

const DELAY = 0

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

export default Cell