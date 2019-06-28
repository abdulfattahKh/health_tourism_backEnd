const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: `test`,
  password: "abdulfattah0952432706"
});

module.exports = connection;