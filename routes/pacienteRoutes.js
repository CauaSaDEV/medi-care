const router = require('express').Router()
const controller = require('../controller/pacienteController')
const {autenticar, autorizar} = require('../middleware/auth')

router.get('/', autenticar,controller.listar);
router.post('/', autenticar,controller.criar);
router.get('/:id', autenticar,controller.buscar)
router.put('/:id', autenticar, controller.atualizar);
router.delete('/:id', autenticar, autorizar('admin'), controller.excluir)
router.patch('/:id', autenticar, controller.desativar)

module.exports = router;