const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', // Localhost cause docker is running in our machine
    user: 'node_server',
    port: 3306,
    password: 'Ps20242025',
    database: 'SafariDojoDB',
    connectTimeout: 10000
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a MySQL:', err.stack);
        return;
    }
    console.log('Conectado a MySQL como id ' + connection.threadId);
});

module.exports = connection;