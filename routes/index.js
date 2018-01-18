const express = require('express')
const router = express.Router()
const controllers = require('../controllers')

router.get('/cards', controllers.cards.getAllCards)
router.post('/cards/:id/apply', controllers.cards.apply)

module.exports = router