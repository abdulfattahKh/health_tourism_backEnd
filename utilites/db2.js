const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "health_tourism",
<<<<<<< HEAD
  password: "12345"
=======
  password: "abdulfattah0952432706"
>>>>>>> ee0640dff71a7619792674306818c422e03f3c70
});

module.exports = connection;
