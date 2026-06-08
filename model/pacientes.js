const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Paciente = sequelize.define("Paciente", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING
    },
    cpf:{
        type: DataTypes.STRING,
        unique: true
    },
    data_de_nascimento:{
        type: DataTypes.DATEONLY    
    },
    telefone:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    endereco:{
        type: DataTypes.STRING
    },
    cidade:{
        type: DataTypes.STRING
    }, 
    estado:{
        type: DataTypes.STRING
    },
    cep:{
        type: DataTypes.STRING
    },
    convenio:{
        type: DataTypes.STRING
    },
    numero_convenio:{
        type: DataTypes.STRING
    },
    ativo:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
   createdBy: {
        type: DataTypes.INTEGER,
        references:{
            model: "Profissional",
            key: "id"
        }
        },
    updatedBy: {
        type: DataTypes.INTEGER,
        references:{
            model: "Profissional",
            key: "id"
        }   
    },
})

module.exports = Paciente