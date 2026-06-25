const jwt = require('jsonwebtoken')
const { Profissional } = require('../model')
 

const autenticar = async(req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(401).json({
            erro: "token não fornecido"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        const profissional = await Profissional.findByPk(decoded.id)
        if (!profissional || !profissional.status) {
            return res.status(401).json({
                erro: "Acesso negado. Usuário inativo ou não encontrado."
            })
        }

        next()
    } catch (err){
        return res.status(401).json({
            erro: "Token invalido ou expirado"
        })
    }

}

//*informações carregadas no payload
const autorizar = (...perfisPermitidos)=> {
    return (req, res, next) => {
        if (!perfisPermitidos.includes(req.user.perfil)){
            return res.status(403).json({erro : "Acesso negado para este perfil"})
        }
        next()
    }
}

module.exports = {autenticar, autorizar}