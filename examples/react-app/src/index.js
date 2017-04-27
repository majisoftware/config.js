import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import ErrorPage from './ErrorPage'
import Loader from './Loader'
import MajiConfig from '../../..'

const config = new MajiConfig({
  apiKey: '-KhwuFB4ZyCEJp27uYOL'
})

const root = document.createElement('div')
document.body.appendChild(root)

// render mounts the give `component`
const render = component => ReactDOM.render(component, root)

// while we're preparing, show a loading indicator
render(<Loader />)

// prepare & render the app
config.prepare().then(() => {
  render(<App config={config} />)
}).catch(err => {
  render(<ErrorPage error={err} />)
})
