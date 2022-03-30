require('dotenv').config();
const MySQL = require('mysql');

const mysql = MySQL.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE,
  multipleStatements: true,
});

const asyncQuery = async (query, values = []) => {
  return new Promise((resolve, reject) => {
    mysql.query(query, values, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

module.exports = { mysql, asyncQuery };
