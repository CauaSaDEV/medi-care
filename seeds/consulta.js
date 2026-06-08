const { Consulta } = require("../model");
const sequelize = require("../config/database");

const seedConsulta = async () => {
  try {
    await sequelize.sync({ force: false });

    const consulta = [
      {
        protocolo: "0001",
        pacienteId: 1, // Maria Oliveira
        medicoId: 1, // Dr. Carlos Silva
        data_consulta: "2025-10-25",
        hora_consulta: "14:00:00",
        tipo: "primeira_consulta",
        status: "confirmada",
        motivo: "Consulta inicial",
        observacoes: null,
        data_confirmacao: new Date("2025-10-20 10:00:00"),
        data_cancelamento: null,
        motivo_cancelamento: null,
        agendado_por: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        protocolo: "0002",
        pacienteId: 2, // João Santos
        medicoId: 2, // Dra. Ana Santos
        data_consulta: "2025-10-25",
        hora_consulta: "10:00:00",
        tipo: "retorno",
        status: "realizada",
        motivo: "Retorno de tratamento",
        observacoes: "Paciente apresentou melhora",
        data_confirmacao: new Date("2025-10-22 09:00:00"),
        data_cancelamento: null,
        motivo_cancelamento: null,
        agendado_por: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        protocolo: "0003",
        pacienteId: 3, // Paula Costa
        medicoId: 1, // Dr. Carlos Silva
        data_consulta: "2025-10-26",
        hora_consulta: "15:30:00",
        tipo: "emergencia",
        status: "agendada",
        motivo: "Dor intensa",
        observacoes: null,
        data_confirmacao: null,
        data_cancelamento: null,
        motivo_cancelamento: null,
        agendado_por: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        protocolo: "0004",
        pacienteId: 4, // Roberto Lima
        medicoId: 2, // Dra. Ana Santos
        data_consulta: "2025-10-23",
        hora_consulta: "09:00:00",
        tipo: "primeira_consulta",
        status: "faltou",
        motivo: "Consulta inicial",
        observacoes: "Paciente não compareceu",
        data_confirmacao: new Date("2025-10-21 14:00:00"),
        data_cancelamento: null,
        motivo_cancelamento: null,
        agendado_por: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const dados of consulta) {
      // findOrCreate evita duplicar se rodar o seed duas vezes
      await Consulta.findOrCreate({
        where: { protocolo: dados.protocolo },
        defaults: dados,
      });
    }

    console.log("Seeds de consultas criadas com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("Erro ao criar seeds de consultas:", err.message);
    process.exit(1);
  }
};

seedConsulta();
