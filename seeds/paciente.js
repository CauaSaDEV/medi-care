const { Paciente } = require("../model");
const sequelize = require("../config/database");

const seedPacientes = async () => {
  try {
    await sequelize.sync({ force: false });

    const paciente = [
      {
        nome: "Maria Oliveira",
        cpf: "111.222.333-44",
        data_de_nascimento: "1985-03-15",
        convenio: "Unimed",
      },
      {
        nome: "João Santos",
        cpf: "222.333.444-55",
        data_de_nascimento: "1990-07-22",
        convenio: "Bradesco Saúde",
      },
      {
        nome: "Paula Costa",
        cpf: "333.444.555-66",
        data_de_nascimento: "1978-11-10",
        convenio: "Particular",
      },
      {
        nome: "Roberto Lima",
        cpf: "444.555.666-77",
        data_de_nascimento: "1995-01-05",
        convenio: "SulAmérica",
      },
    ];
    for (const dados of paciente) {
      // findOrCreate evita duplicar se rodar o seed duas vezes
      await Paciente.findOrCreate({
        where: { cpf: dados.cpf },
        defaults: dados,
      });
    }

    console.log("Seeds de pacientes criados com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("Erro ao criar seeds de pacientes:", err.message);
    process.exit(1);
  }
};
seedPacientes();
