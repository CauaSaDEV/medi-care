const router = require('express').Router()
const controller = require('../controller/profissionalController')
const { autenticar, autorizar } = require('../middleware/auth')

router.get('/', autenticar, autorizar('admin'), controller.listar)
router.get('/:id',autenticar, autorizar('admin'), controller.buscar)
router.post('/', autenticar, autorizar('admin'), controller.criar)
router.patch('/:id', autenticar, autorizar('admin'), controller.atualizar)
router.delete('/:id', autenticar, autorizar('admin'), controller.excluir)

module.exports = router