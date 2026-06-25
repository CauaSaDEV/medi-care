const router = require('express').Router()
const controller = require('../controller/medicoController')
const controller2 = require('../controller/consultaController')
const { autenticar } = require('../middleware/auth')

router.get('/', autenticar, controller.listar)
router.get('/:id', autenticar, controller.buscar)
router.get('/:id/consultas', autenticar, controller2.consultasPorMedico)

module.exports = router