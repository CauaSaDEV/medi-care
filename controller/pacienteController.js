const { Paciente } = require("../model")
const sequelize = require ('sequelize')

const listar = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
            where: { ativo: true },
            order: [['nome', 'ASC']]
        })
        res.json(pacientes)

    } catch (err) {
        return res.status(500).json({ erro: "Erro interno", detalhe: err.message });
    }
}

const buscar = async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);

        if (!paciente) {
            return res.status(404).json({ Erro: "Paciente nao encontrado" });
        }
        res.json(paciente)
    } catch (err) {
        return res.status(500).json({ erro: "Erro interno", detalhe: err.message });
    }
}

const criar = async (req, res) => {
    try {
        const paciente = await Paciente.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json(paciente);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            const campo = err.errors[0].path; 
            const mensagens = {
                cpf: 'CPF já cadastrado',
                email: 'E-mail já cadastrado'
                
            };
            return res.status(400).json({ erro: mensagens[campo] || 'Dado duplicado' });
        }
        return res.status(500).json({ erro: 'Erro interno', detalhe: err.message });
    }
}

    const atualizar = async (req, res) => {
        try {
            const paciente = await Paciente.findByPk(req.params.id);
            if (!paciente) {
                return res.status(404).json({ erro: "paciente não encontrado" });
            }
            await paciente.update({ ...req.body, updatedBy: req.user.id });
            res.json(paciente);

        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                const campo = err.errors[0].path; 
                const mensagens = {
                    cpf: 'CPF já cadastrado',
                    email: 'E-mail já cadastrado'
                };
                return res.status(400).json({ erro: mensagens[campo] || 'Dado duplicado' });
            }
            return res.status(500).json({ erro: 'Erro interno', detalhe: err.message });
        }

    }
    const desativar = async (req, res) => {
        try {
            const paciente = await Paciente.findByPk(req.params.id);
            if (!paciente) {
                return res.status(404).json({ Erro: "Paciente nao encontrado" });
            }
            await paciente.update({ ativo: false, updatedBy: req.user.id });
            res.json({ mensagem: 'Paciente desativado com sucesso' });


        } catch (err) {
            res.status(500).json({ erro: 'Erro ao desativar paciente' });
        }
    }
    const excluir = async (req, res)=>{
        try{
            const paciente = await Paciente.findByPk(req.params.id);
            if (!paciente) {
                return res.status(404).json({ Erro: "Paciente nao encontrado" });
            }
            await paciente.destroy();
            res.json({ mensagem: 'Paciente excluído com sucesso' });

        }catch(err){
            res.status(500).json({ erro: 'Erro ao excluir paciente' });
        }
        
    }
    module.exports = { listar, buscar, criar, atualizar, desativar, excluir };

