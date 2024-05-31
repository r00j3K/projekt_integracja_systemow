const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING(2048),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tags: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    votes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

module.exports = Article;
