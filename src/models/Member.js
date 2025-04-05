const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Member = sequelize.define('Member', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }



}, {
    tableName: 'members',
    timestamps: false
});

module.exports = Member;
