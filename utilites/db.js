const mysql = require("mysql2");

const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "health_tourism",
  password: "12345",
  multipleStatements: true
});

module.exports = pool.promise();
