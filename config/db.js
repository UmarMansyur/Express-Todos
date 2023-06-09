require('dotenv').config();
const mariadb = require('mariadb');
const { DB_USER, DB_PASS, DB_HOST, DB_DATABASE } = process.env;

const pool = mariadb.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_DATABASE,
  connectionLimit: 5
});


async function query(query, data = null) {
  try {
    const conn = await pool.getConnection();
    const response = await conn.query(query, data);
    conn.end();
    return response;
  } catch (error) {
    console.log(error);
  }
}

module.exports = query;

