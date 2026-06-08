const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Profissional = sequelize.define("Profissional", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING,
    },
    email:{
        type: DataTypes.STRING,
        unique: true  
    },
    senha_hash:{
        type: DataTypes.STRING
    },
    crm:{
        type: DataTypes.STRING,
        unique: true
    },
    especialidade:{
        type: DataTypes.STRING
    },
    perfil:{
        type: DataTypes.ENUM('admin', 'medico', 'recepcionista')
    },
    status:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
    }, {
      
    tableName: 'profissional'
   
    
});

module.exports = Profissional
