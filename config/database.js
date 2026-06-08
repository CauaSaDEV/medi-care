const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './medicare.db',
    logging: false
})

module.exports = sequelize