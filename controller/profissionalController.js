const { Profissional } = require("../model");
const bcrypt = require("bcrypt");

const listar = async (req, res) => {
  try {
    const profissionais = await Profissional.findAll({
      where: { status: true },
      attributes: { exclude: ["senha_hash"] },
      order: [["nome", "ASC"]],
    });
    res.json(profissionais);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};

const buscar = async (req, res) => {
  try {
    const profissional = await Profissional.findByPk(req.params.id, {
      attributes: { exclude: ["senha_hash"] },
    });
    if (!profissional)
      return res.status(404).json({ erro: "Profissional não encontrado" });
    res.json(profissional);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};

// POST /api/profissionais - RF01
const criar = async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      crm,
      especialidade,
      perfil,
      dias_disponiveis,
      horario_inicio,
      horario_fim,
    } = req.body;

    const senha_hash = await bcrypt.hash(senha, 10);

    const profissional = await Profissional.create({
      nome,
      email,
      senha_hash,
      crm,
      especialidade,
      perfil,
      status: true,
      dias_disponiveis, 
      horario_inicio,
      horario_fim,
    });

    const { senha_hash: _, ...retorno } = profissional.toJSON();
    res.status(201).json(retorno);
  } catch (err) {
    // RN02 - CRM e e-mail únicos
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

// PATCH /api/profissionais/:id - atualiza qualquer campo, incluindo status
const atualizar = async (req, res) => {
  try {
    const profissional = await Profissional.findByPk(req.params.id);
    if (!profissional)
      return res.status(404).json({ erro: "Profissional não encontrado" });

    const dados = { ...req.body };
    if (dados.senha) {
      dados.senha_hash = await bcrypt.hash(dados.senha, 10);
      delete dados.senha;
    }

    await profissional.update(dados);
    const { senha_hash: _, ...retorno } = profissional.toJSON();
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

// DELETE /api/profissionais/:id
const excluir = async (req, res) => {
  try {
    const profissional = await Profissional.findByPk(req.params.id);
    if (!profissional)
      return res.status(404).json({ erro: "Profissional não encontrado" });

    await profissional.destroy();
    res.json({ mensagem: "Profissional excluído com sucesso" });
  } catch (err) {
    if (err.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        erro: "Não é possível excluir este profissional pois ele possui consultas vinculadas. Considere alterar o status para inativo.",
      });
    }
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};

module.exports = { listar, buscar, criar, atualizar, excluir };
