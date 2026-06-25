const router = require('express').Router()
const controller = require('../controller/pacienteController')
const controller2 = require('../controller/consultaController')
const { autenticar, autorizar } = require('../middleware/auth')

router.get('/', autenticar, controller.listar)
router.post('/', autenticar,controller.criar)
router.get('/:id', autenticar,controller.buscar)
router.get('/:id/historico', autenticar, controller2.historicoPaciente)
router.put('/:id', autenticar, controller.atualizar)
router.delete('/:id', autenticar, autorizar('admin', 'recepcionista'), controller.excluir)


module.exports = router;