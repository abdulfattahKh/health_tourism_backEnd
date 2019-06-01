const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit : 10,
  host: "localhost",
  user: "root",
  database: "testing",
  password: "12345"
});

module.exports = pool.getConnection;