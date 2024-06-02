const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'node_sequelize_api_db', // Database name
    'root', // Username
    'root', { // Password
        host: 'mysql', // Hostname of the MySQL service defined in Docker Compose
        dialect: 'mysql',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        }
    }
);

module.exports = sequelize;
