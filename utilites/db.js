const mysql = require("mysql2");

const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: `health_tourism`,
  password: "abdulfattah0952432706"
});

module.exports = pool.promise();
