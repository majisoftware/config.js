import React, { Component } from 'react'
import PropTypes from 'prop-types'

class App extends Component {
  constructor (props) {
    super()
    this.state = { backgroundColor: 'blue' }
    this.config = props.config
    this.config.on('change', this.onConfigUpdate.bind(this))
  }

  render () {
    return (
      <div className='App' style={{ backgroundColor: this.state.backgroundColor }}>
        <h1>This is an example app.</h1>
        <p>Adding your <code>apiKey</code> to <strong>index.js</strong> will give you the ability to change its settings.</p>
        <p>Currently, you’re able to chage the <code>backgroundColor</code>, but the ability to change nearly anything could be added.</p>
      </div>
    )
  }

  componentDidMount () {
    const backgroundColor = this.config.get('backgroundColor')
    this.setState({ backgroundColor })
  }

  onConfigUpdate (key, value) {
    this.setState({ [key]: value })
  }
}

App.propTypes = {
  config: PropTypes.shape({
    get: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired
  }).isRequired
}

export default App
