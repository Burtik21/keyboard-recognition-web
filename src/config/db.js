const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // Název databáze
  process.env.DB_USER,      // Uživatelské jméno
  process.env.DB_PASSWORD,  // Heslo
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
