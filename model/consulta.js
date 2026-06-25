const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Consulta = sequelize.define("Consulta", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    protocolo:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    pacienteId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "pacientes",
            key: "id"
        }
    },
    medicoId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "profissional",
            key: "id"
        }
    },
    data_consulta:{
        type: DataTypes.DATEONLY
    },
    hora_consulta:{
        type: DataTypes.STRING
    },
    tipo:{
        type: DataTypes.ENUM('primeira_consulta', 'retorno', 'emergencia')
    },
    status:{
        type: DataTypes.ENUM('agendada','confirmada','em_atendimento','realizada', 'cancelada', 'faltou'),
        defaultValue: 'agendada'
    },
    motivo:{
        type: DataTypes.TEXT
    },
    observacoes:{
        type: DataTypes.TEXT
    },
    data_confirmacao:{
        type: DataTypes.DATE
    },
    data_cancelamento:{
        type: DataTypes.DATE
    },
    motivo_cancelamento:{
        type: DataTypes.TEXT
    },
    agendado_por:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "profissional",
            key: "id"
        }
    }
})

module.exports = Consulta

