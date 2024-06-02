const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'node_sequelize_api_db', 
    'root', 
    'root', { 
        host: 'mysql', 
        dialect: 'mysql',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        }
    }
);

module.exports = sequelize;
