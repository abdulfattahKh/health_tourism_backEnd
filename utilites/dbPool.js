const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "testing",
  password: "12345"
});
module.exports = pool;
