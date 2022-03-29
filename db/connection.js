require('dotenv').config();
const MySQL = require('mysql');

module.exports.mysql = MySQL.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE,
  multipleStatements: true,
});
