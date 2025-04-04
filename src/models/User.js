const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Předpokládám, že máš již nakonfigurovaný sequelize

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true, // Unikátní uživatelské jméno
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false, // Tento sloupec nebude povolen prázdný
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true, // Unikátní email
    },
    created_at: {
        type: DataTypes.TIMESTAMP,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.TIMESTAMP,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
}, {
    tableName: 'users', // Název tabulky v databázi
    timestamps: false, // Nepoužíváme automatické createdAt/updatedAt sloupce
});

module.exports = User;
