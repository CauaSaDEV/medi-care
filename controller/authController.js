const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Profissional } = require('../model')

const login = async (req, res) => {
    const { email, senha } = req.body

    try {
        const profissional = await Profissional.findOne({ where: { email } })

        if(!profissional){
        return res.status(401).json({ erro : "Credenciais invalidas" })
        }

        if(!profissional.status){
            return res.status(403).json({erro : "Profissional Inativo"})
        }
        const senhaCorreta = await bcrypt.compare(senha, profissional.senha_hash)

        if(!senhaCorreta){
        return res.status(401).json({ erro: "Credenciais invalidas"})
        }

        const token = jwt.sign(
            { id: profissional.id, perfil: profissional.perfil },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN}
        )
        res.json({
            token,
            profissional:{
                id: profissional.id,
                nome: profissional.nome,
                perfil: profissional.perfil
            }
        })

    } catch (err) {
        res.status(500).json({ erro: "Erro interno", detalhe: err.message})
    }   
}
//! para que serve este caralho aqui
const me = async (req, res) => {
        const profissional = await Profissional.findByPk(req.user.id, {
            attributes: {exclude: ['senha_hash']}
        })
        res.json(profissional)
}
module.exports = { login, me }