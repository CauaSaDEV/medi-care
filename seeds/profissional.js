const bcrypt = require("bcrypt");
const { Profissional } = require("../model");
const sequelize = require("../config/database");

const seedProfissional = async () => {
  try {
    await sequelize.sync({ force: false });

    const profissional = [
      {
        nome: "Administrador",
        email: "admin@medicare.com",
        senha_hash: await bcrypt.hash("admin@123", 10),
        crm: null,
        especialidade: null,
        perfil: "admin",
        status: true,
      },
      {
        nome: "Dr. Carlos Silva",
        email: "carlos@medicare.com",
        senha_hash: await bcrypt.hash("Med@123", 10),
        crm: "12345-SP",
        especialidade: "Cardiologia",
        perfil: "medico",
        status: true,
        horario_inicio: "08:00",
        horario_fim: "18:00",
        dias_disponiveis: "seg,ter,qua,qui,sex",
      },
      {
        nome: "Dra. Ana Santos",
        email: "ana@medicare.com",
        senha_hash: await bcrypt.hash("Med@123", 10),
        crm: "67890-SP",
        especialidade: "Pediatria",
        perfil: "medico",
        status: true,
        horario_inicio: "08:00",
        horario_fim: "18:00",
        dias_disponiveis: "seg,qua,sex",
      },
      {
        nome: "Recepcionista",
        email: "recepcao@medicare.com",
        senha_hash: await bcrypt.hash("Recep@123", 10),
        crm: null,
        especialidade: null,
        perfil: "recepcionista",
        status: true,
      },
    ];

    for (const dados of profissional) {
      // findOrCreate evita duplicar se rodar o seed duas vezes
      await Profissional.findOrCreate({
        where: { email: dados.email },
        defaults: dados,
      });
    }

    console.log("Seeds de profissionais criadas com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("Erro ao criar seeds de profissionais:", err.message);
    process.exit(1);
  }
};

seedProfissional();
