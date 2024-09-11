const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
    dialect: 'postgres',
    logging: false, // Set to true to see SQL queries in the console
});

module.exports = sequelize;
