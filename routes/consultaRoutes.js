const router = require('express').Router()
const controller = require('../controller/consultaController')
const { autenticar, autorizar } = require('../middleware/auth')


router.get('/', autenticar,controller.listar)
router.get('/:id', autenticar,controller.buscar)
router.post('/', autenticar, autorizar('admin', 'recepcionista'), controller.agendar)
router.patch('/:id/confirmar', autenticar, controller.confirmar)
router.patch('/:id/cancelar', autenticar, controller.cancelar)
router.patch('/:id/status', autenticar, controller.atualizarStatus)




module.exports = router