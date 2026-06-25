const { Profissional } = require('../model')

const listar = async (req, res) => {
  try {
    const medicos = await Profissional.findAll({
      where: { perfil: 'medico', status: true },
      attributes: { exclude: ['senha_hash'] },
      order: [['nome', 'ASC']]
    })
    res.json(medicos)
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno', detalhe: err.message })
  }
}

const buscar = async (req, res) => {
  try {
    const medico = await Profissional.findOne({
      where: { id: req.params.id, perfil: 'medico' },
      attributes: { exclude: ['senha_hash'] }
    })
    if (!medico) return res.status(404).json({ erro: 'Médico não encontrado' })
    res.json(medico)
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno', detalhe: err.message })
  }
}

module.exports = { listar, buscar }