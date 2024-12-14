const sql = require('mssql');

// Database configuration from environment variables
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use encryption for Azure SQL
        trustServerCertificate: false, // Disable for production if self-signed certs aren't used
    },
};

// Function to connect to the database
const connectToDatabase = async () => {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to Azure SQL Database');
        return pool;
    } catch (err) {
        console.error('Database connection failed', err);
        throw err;
    }
};

module.exports = connectToDatabase;