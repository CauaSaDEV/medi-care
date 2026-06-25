const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Profissional = sequelize.define("Profissional", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    senha_hash: {
        type: DataTypes.STRING
    },
    crm: {
        type: DataTypes.STRING,
        unique: true
    },
    especialidade: {
        type: DataTypes.STRING
    },
    perfil: {
        type: DataTypes.ENUM('admin', 'medico', 'recepcionista')
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    horario_inicio: {
        type: DataTypes.STRING, // formato "HH:mm", ex: "08:00"
        allowNull: true
    },
    horario_fim: {
        type: DataTypes.STRING, // formato "HH:mm", ex: "18:00"
        allowNull: true
    },
    dias_disponiveis: {
        type: DataTypes.STRING, // ex: "seg,ter,qua,qui,sex"
        allowNull: true
    }
}, {
    tableName: 'profissional'
});

module.exports = Profissional