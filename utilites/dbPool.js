const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  database: `health_tourism`,
  password: "abdulfattah0952432706"
});

module.exports = pool;
