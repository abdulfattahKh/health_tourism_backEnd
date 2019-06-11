const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "health_tourism",
  password: "12345"
});

module.exports = connection;
