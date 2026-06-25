const { Consulta, Profissional, Paciente, Atendimento } = require("../model");
const { Op } = require("sequelize");

function horaParaMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

const diasSemanaMap = [
  "dom", 
  "seg", 
  "ter", 
  "qua", 
  "qui", 
  "sex", 
  "sab"
];

const agendar = async (req, res) => {
  try {
    const { pacienteId, medicoId, data_consulta, hora_consulta, tipo, motivo } =
      req.body;

    const paciente = await Paciente.findByPk(pacienteId);

    if (!paciente) {
      return res.status(404).json({
        erro: "Paciente não encontrado",
      });
    }

    const medico = await Profissional.findOne({
      where: {
        id: medicoId,
        perfil: "medico",
        status: true,
      },
    });

    if (!medico) {
      return res.status(404).json({
        erro: "Médico não encontrado ou inativo",
      });
    }

    const [ano, mes, dia] = data_consulta.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);

    const diaSemana = diasSemanaMap[data.getDay()];

    const diasDisponiveis = medico.dias_disponiveis
      ? medico.dias_disponiveis.split(",")
      : [];

    if (!diasDisponiveis.includes(diaSemana)) {
      return res.status(400).json({
        erro: "Médico não atende neste dia da semana",
      });
    }

    const minutosConsulta = horaParaMinutos(hora_consulta);
    const minutosInicio = horaParaMinutos(medico.horario_inicio);
    const minutosFim = horaParaMinutos(medico.horario_fim);

    if (minutosConsulta < minutosInicio || minutosConsulta >= minutosFim) {
      return res.status(400).json({
        erro: "Horário fora do expediente do médico",
      });
    }

    const consultasDoDia = await Consulta.findAll({
      where: {
        medicoId,
        data_consulta,
        status: {
          [Op.notIn]: ["cancelada", "faltou"],
        },
      },
    });

    for (const consulta of consultasDoDia) {
      const diff = Math.abs(
        horaParaMinutos(consulta.hora_consulta) - minutosConsulta,
      );

      if (diff < 30) {
        return res.status(400).json({
          erro: "Horário muito próximo de outra consulta (mínimo 30 minutos)",
        });
      }
    }

    const consultaExistente = await Consulta.findOne({
      where: {
        pacienteId,
        medicoId,
        data_consulta,
        status: {
          [Op.notIn]: ["cancelada", "faltou"],
        },
      },
    });

    if (consultaExistente) {
      return res.status(400).json({
        erro: "Paciente já possui consulta agendada com este médico nesta data",
      });
    }

    const consulta = await Consulta.create({
      pacienteId,
      medicoId,
      data_consulta,
      hora_consulta,
      tipo,
      motivo,
      status: "agendada",
      protocolo: 0,
      agendado_por: req.user.id,
    });

    consulta.protocolo = String(consulta.id).padStart(4, "0");

    await consulta.save();

    return res.status(201).json(consulta);
  } catch (err) {
    return res.status(500).json({
      erro: "Erro interno",
      detalhe: err.message,
    });
  }
};
const listar = async (req, res) => {
  try {
    const { medicoId, pacienteId, data_consulta, status } = req.query;

    const where = {};
    if (medicoId) where.medicoId = medicoId;
    if (pacienteId) where.pacienteId = pacienteId;
    if (data_consulta) where.data_consulta = data_consulta;
    if (status) where.status = status;

    const consultas = await Consulta.findAll({
      where,
      include: [
        { model: Paciente, as: "paciente", attributes: ["id", "nome", "cpf"] },
        {
          model: Profissional,
          as: "medicoConsulta",
          attributes: ["id", "nome", "especialidade"],
        },
      ],
      order: [
        ["data_consulta", "ASC"],
        ["hora_consulta", "ASC"],
      ],
    });

    res.json(consultas);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};
const buscar = async (req, res) => {
  try {
    const consulta = await Consulta.findByPk(req.params.id, {
      include: [
        { model: Paciente, as: "paciente" },
        {
          model: Profissional,
          as: "medicoConsulta",
          attributes: { exclude: ["senha_hash"] },
        },
      ],
    });
    if (!consulta)
      return res.status(404).json({ erro: "Consulta não encontrada" });
    res.json(consulta);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};
const confirmar = async (req, res) => {
  try {
    const consulta = await Consulta.findByPk(req.params.id);
    if (!consulta)
      return res.status(404).json({ erro: "Consulta não encontrada" });

    if (consulta.status !== "agendada") {
      return res
        .status(400)
        .json({ erro: "Apenas consultas agendadas podem ser confirmadas" });
    }

    await consulta.update({
      status: "confirmada",
      data_confirmacao: new Date(),
    });

    res.json(consulta);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};
const cancelar = async (req, res) => {
  try {
    const { motivo_cancelamento } = req.body;
    const consulta = await Consulta.findByPk(req.params.id);
    if (!consulta)
      return res.status(404).json({ erro: "Consulta não encontrada" });

    if (["cancelada", "realizada"].includes(consulta.status)) {
      return res
        .status(400)
        .json({ erro: "Esta consulta não pode ser cancelada" });
    }

    // RN07 - verifica prazo mínimo de 4h
    const [ano, mes, dia] = consulta.data_consulta.split("-").map(Number);
    const [hora, minuto] = consulta.hora_consulta.split(":").map(Number);
    const dataHoraConsulta = new Date(ano, mes - 1, dia, hora, minuto);

    const agora = new Date();
    const diffHoras = (dataHoraConsulta - agora) / (1000 * 60 * 60);

    if (diffHoras < 4) {
      return res.status(400).json({
        erro: "Cancelamento só é permitido com no mínimo 4h de antecedência",
      });
    }

    await consulta.update({
      status: "cancelada",
      data_cancelamento: new Date(),
      motivo_cancelamento,
    });

    res.json(consulta);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};
const atualizarStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const consulta = await Consulta.findByPk(req.params.id);
    if (!consulta)
      return res.status(404).json({ erro: "Consulta não encontrada" });

    // RN11
    if (consulta.status === "realizada") {
      return res
        .status(400)
        .json({ erro: "Consulta realizada não pode ser editada" });
    }

    await consulta.update({ status });
    res.json(consulta);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};
const agendaDoDia = async (req, res) => {
  try {
    const data = req.query.data || new Date().toISOString().split("T")[0];

    const consultas = await Consulta.findAll({
      where: { data_consulta: data },
      include: [
        { model: Paciente, as: "paciente", attributes: ["id", "nome"] },
        {
          model: Profissional,
          as: "medicoConsulta",
          attributes: ["id", "nome", "especialidade"],
        },
      ],
      order: [["hora_consulta", "ASC"]],
    });

    res.json(consultas);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};
const consultasPorMedico = async (req, res) => {
  try {
    const consultas = await Consulta.findAll({
      where: { medicoId: req.params.id },
      include: [
        { model: Paciente, as: "paciente", attributes: ["id", "nome"] },
      ],
      order: [
        ["data_consulta", "DESC"],
        ["hora_consulta", "ASC"],
      ],
    });
    res.json(consultas);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};
const historicoPaciente = async (req, res) => {
  try {
    const consultas = await Consulta.findAll({
      where: { pacienteId: req.params.id },
      include: [
        { 
          model: Profissional, 
          as: "medicoConsulta", 
          attributes: ["id", "nome", "especialidade"] 
        },
        {
          model: Paciente,
          as: "paciente",
          attributes: ["nome", "cpf", "telefone", "convenio"] 

        },
        { 
          model: Atendimento, // Inclui o registo médico!
          as: "atendimento" 
        }
      ],
      order: [
        ["data_consulta", "DESC"], // As mais recentes primeiro
        ["hora_consulta", "DESC"],
      ],
    });
    res.json(consultas);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno", detalhe: err.message });
  }
};

module.exports = {
  agendar,
  listar,
  buscar,
  confirmar,
  cancelar,
  atualizarStatus,
  agendaDoDia,
  consultasPorMedico,
  historicoPaciente,
};
