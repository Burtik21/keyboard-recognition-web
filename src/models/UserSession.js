const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


    const UserSession = sequelize.define('UserSession', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        memberId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'members', // Odkaz na tabulku members
                key: 'id', // Primární klíč v tabulce members
            },
            onDelete: 'CASCADE', // Pokud bude člen smazán, odstraní se i jeho session
        },
        deviceType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isRecording: {  // Sloupec pro označení, zda probíhá nahrávání
            type: DataTypes.TINYINT(1),
            defaultValue: 0  // 0 = nahrávání neprobíhá, 1 = nahrávání probíhá
        },
        recordingId: {  // Sloupec pro přiřazení konkrétního nahrávacího ID
            type: DataTypes.INTEGER,
            allowNull: true  // Tento sloupec může být null, pokud nahrávání neprobíhá
        },
        sessionId: {  // Přidáme sessionId, aby bylo propojeno s konkrétní session
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,  // Session ID by mělo být jedinečné
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('NOW'),
        },



    }, {
        tableName: 'usersessions',
        timestamps: false, // Nechceme, aby Sequelize automaticky přidával `createdAt` a `updatedAt`, protože už máme `createdAt` jako sloupec


    });

module.exports = UserSession;