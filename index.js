const express = require('express')
const app = express()
const routes = require('./routes')
const path = require('path')
const Ddos = require('ddos')
const cors = require('cors')
const bodyParser = require('body-parser')

// rate limit requests by ip
const ddos = new Ddos({ burst: 10, limit: 15 })

// allow cors
app.use(cors())

// body parse incoming reqs as json for convenience
app.use(bodyParser.json())

app.get('/docs', (req, res) => res.sendFile(path.join(__dirname, '/docs/index.html')))

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
