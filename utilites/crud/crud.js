const db = require("../db");

exports.delete = (tableName, { fieldName, fieldValue }, options = []) => {
  return db.execute(`delete from ${tableName} where ${fieldName} = ?`, [
    fieldValue
  ]);
};
