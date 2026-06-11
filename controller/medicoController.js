const { Profissional } = require("../model");
const bcrypt = require("bcrypt");

const listar = async (req, res) => {
  try {
    const medicos = await Profissional.findAll({
      where: { perfil: "medico", status: true },
      attributes: { exclude: ["senha_hash"] },
      order: [["nome", "ASC"]],
    });
    res.json(medicos);
  } catch (err) {
    return res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};
const buscar = async (req, res) => {
  try {
    const medico = await Profissional.findOne({
      where: { id: req.params.id, perfil: "medico" },
      attributes: { exclude: ["senha_hash"] },
    });
    if (!medico) return res.status(404).json({ erro: "Médico não encontrado" });
    res.json(medico);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};
const criar = async (req, res) => {
  try {
    const { nome, email, senha, crm, especialidade } = req.body;
    const senha_hash = await bcrypt.hash(senha, 10);

    const medico = await Profissional.create({
      nome,
      email,
      senha_hash,
      crm,
      especialidade,
      perfil: "medico",
      status: true,
    });

    const { senha_hash: _, ...retorno } = medico.toJSON();
    res.status(201).json(retorno);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const campo = err.errors[0].path;
      const mensagens = {
        email: "E-mail já cadastrado",
        crm: "CRM já cadastrado",
      };
      return res
        .status(400)
        .json({ erro: mensagens[campo] || "Dado duplicado" });
    }
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};

const atualizar = async (req, res) => {
  try {
    const medico = await Profissional.findOne({
      where: { id: req.params.id, perfil: "medico" },
    });
    if (!medico) return res.status(404).json({ erro: "Médico não encontrado" });

    const dados = { ...req.body };
    if (dados.senha) {
      dados.senha_hash = await bcrypt.hash(dados.senha, 10);
      delete dados.senha;
    }

    await medico.update(dados);
    const { senha_hash: _, ...retorno } = medico.toJSON();
    res.json(retorno);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const campo = err.errors[0].path;
      const mensagens = {
        email: "E-mail já cadastrado",
        crm: "CRM já cadastrado",
      };
      return res
        .status(400)
        .json({ erro: mensagens[campo] || "Dado duplicado" });
    }
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};
const desativar = async (req, res) => {
  try {
    const medico = await Profissional.findOne({
      where: { id: req.params.id, perfil: "medico" },
    });
    if (!medico) return res.status(404).json({ erro: "Médico não encontrado" });

    await medico.update({ status: false });
    res.json({ mensagem: "Médico desativado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};
const excluir = async (req, res)=>{
        try{
            const paciente = await Profissional.findByPk(req.params.id);
            if (!paciente) {
                return res.status(404).json({ Erro: "Medico nao encontrado" });
            }
            await paciente.destroy();
            res.json({ mensagem: 'Medico excluído com sucesso' });

        }catch(err){
            res.status(500).json({ erro: 'Erro ao excluir Medico' });
        }
        
    }

module.exports = { listar, buscar, criar, atualizar, desativar, excluir };
