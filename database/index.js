const mysql = require('mysql2/promise');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({
    path: __dirname + '/../.env.local'
  });
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
  } catch (error) {
    console.error('Error establishing database connection:  ', error);
  }
};

module.exports = {
  pool,
  initializeDatabase
};