const {DataTypes} = require('sequelize');
const sequelize = require('../db');
const User = require('./userModel');

const userArticle = sequelize.define('userArticle', {
   id: {
     primaryKey: true,
     allowNull:false,
       autoIncrement: true,
     type: DataTypes.INTEGER
   },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    title: {
       type: DataTypes.STRING,
        allowNull: false,
   },
    description: {
       type: DataTypes.STRING,
        allowNull: false
    },
    category: {
       type: DataTypes.ENUM('świat', 'polska', 'polityka', 'medycyna', 'przestępstwa', 'żywienie', 'sport'),
    }
});

User.hasMany(userArticle, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE' });
userArticle.belongsTo(User, {
    foreignKey: 'user_id',
});


module.exports = userArticle;
