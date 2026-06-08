const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Atendimento = sequelize.define("Atendimento", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    consultaId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: "Consulta",
            key: "id"
        }
    },
    anamnese:{
        type: DataTypes.TEXT
    },
    diagnostico:{
        type: DataTypes.TEXT
    },
    prescricao:{
        type: DataTypes.TEXT
    },
    observacoes:{
        type: DataTypes.TEXT
    },
    exames_solicitados:{
        type: DataTypes.TEXT
    },
    retorno_dias:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    medicoId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "profissional",
            key: "id"
        }
    },
    data_atendimento:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW 
    }  
})

module.exports = Atendimento