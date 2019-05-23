const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "health_toursim",
  password: "abdulfattah0952432706"
});
module.exports = pool;
