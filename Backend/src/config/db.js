const mysql = require('mysql2');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

console.log({
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME
});

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 14482,

    ssl: {
        ca: fs.readFileSync(process.env.DB_SSL_CA_PATH),
        rejectUnauthorized: true
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test de connexion au pool
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erreur de connexion au pool :', err);
    } else {
        console.log('Connexion MySQL (pool) réussie');
        connection.release();
    }
});

module.exports = db;