require("dotenv").config();

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection();

        console.log("----------------------------------------");
        console.log("MySQL database connected successfully!");
        console.log(`Database: ${process.env.DB_NAME}`);
        console.log("----------------------------------------");

        connection.release();

        return true;
    } catch (error) {
        console.error("----------------------------------------");
        console.error("MySQL database connection FAILED.");
        console.error("Error:", error.message);
        console.error("----------------------------------------");

        return false;
    }
}

module.exports = {
    pool,
    testDatabaseConnection
};