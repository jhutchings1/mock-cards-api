const express = require('express')
const app = express()
const routes = require('./routes')
const Ddos = require('ddos')
const bodyParser = require('body-parser')

// rate limit requests by ip
const ddos = new Ddos({ burst: 10, limit: 15 })

// body parse incoming reqs as json for convenience
app.use(bodyParser.json())

// prevent ddos
app.use(ddos.express)

// use routes
app.use('/api/v1/', routes)

// serve frontend
app.use(express.static('public'))

// set default port and listen
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Checkout listening on port ${port}!`)
})

module.exports = app
