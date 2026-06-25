const router = require('express').Router()
const controller = require('../controller/consultaController')
const  { autenticar } = require('../middleware/auth')

router.get('/', autenticar, controller.agendaDoDia)

module.exports = router