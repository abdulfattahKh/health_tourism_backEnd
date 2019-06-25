const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: `test`,
  password: "12345"
});

module.exports = connection;
