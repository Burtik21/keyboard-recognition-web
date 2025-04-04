const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./Member');  // Pokud máš model pro uživatele, importuj ho

const Recording = sequelize.define('Recording', {
    recording_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,  // Předpokládáme, že máš model User pro cizí klíč
            key: 'user_id'
        },
        onDelete: 'CASCADE'  // Když je uživatel smazán, smaž i jeho nahrávky
    },
    recording_file_path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    click_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.TIMESTAMP,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'recordings',
    timestamps: false  // Nepotřebujeme createdAt/updatedAt sloupce
});

Recording.belongsTo(User, { foreignKey: 'user_id' });  // Vztah mezi Recording a User

module.exports = Recording;
