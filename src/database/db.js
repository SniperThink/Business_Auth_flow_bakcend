// src/database/db.js
const { Pool } = require('pg');

// Replace with your actual credentials of live server while hosting ----> this is for local development
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sniperthink',
  password: 'root',
  port: 5432,
});

// Optional: Test connection once
const connectDb = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection test successful');
  } catch (err) {
    console.error('Database connection test failed', err);
    throw err;
  }
};

module.exports = {
  connectDb,
  pool
};
