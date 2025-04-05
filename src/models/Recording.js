const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Member = require('./Member');  // Pokud máš model pro uživatele, importuj ho

const Recording = sequelize.define('Recording', {
    recording_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Member,  // Předpokládáme, že máš model User pro cizí klíč
            key: 'user_id'
        },
        onDelete: 'CASCADE'  // Když je uživatel smazán, smaž i jeho nahrávky
    },
    click_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    duration: {
        type: DataTypes.INTEGER,  // Ukládáme v sekundách (můžeš použít INTEGER pro sekundy nebo minutách)
        allowNull: true,
    }
}, {
    tableName: 'recordings',
    timestamps: false  // Nepotřebujeme createdAt/updatedAt sloupce
});

Recording.belongsTo(Member, { foreignKey: 'member_id' });  // Vztah mezi Recording a User

module.exports = Recording;
