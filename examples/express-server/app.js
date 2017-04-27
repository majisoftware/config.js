const express = require('express')
const morgan = require('morgan')
const http = require('http')
const MajiConfig = require('../..')

const app = express()

const config = new MajiConfig({
  apiKey: '-KhwuFB4ZyCEJp27uYOL'
})

app.use(morgan('dev'))

// respond to requests
app.get('/', (req, res) => {
  const { name = 'World' } = req.query
  const greeting = config.get('greeting')
  res.send(`${greeting} ${name}`)
})

config.prepare().then(() => {
  let server = null

  // listen starts the server on the configured port
  const listen = () => {
    const port = config.get('port')
    server = http.createServer(app)
    server.listen(port, err => {
      if (err) {
        throw err
      }

      console.log(`> listening at http://localhost:${port}`)
    })
  }

  listen()

  // listen for port change events, then restart the server
  config.on('change', (key, value) => {
    if (key === 'port') {
      console.log('> caught "port" change. reloading server.')
      server.close(() => {
        console.log('> killed previous server')
        listen()
      })
    }
  })
}).catch(err => {
  console.error()
  console.error(' Failed to start example app. Please check your apiKey and host variables.')
  console.error()
  console.error(err)
  console.error()
})
