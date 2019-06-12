const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "health_toursim",
  password: "abdulfattah0952432706"
});

module.exports = connection;
