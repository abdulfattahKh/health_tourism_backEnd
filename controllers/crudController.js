const db = require("../utilites/db");
const Crud = require("../models/crud.model");
module.exports.updateValues = (tablName, fieldName, id, values) => {
  return new Promise(async (resolve, reject) => {
    try {
      const saveRes = await Crud.updateValues(tablName, fieldName, id, values);
      if (saveRes[0].affectedRows == 0) {
        resolve({ success: true, statusCode: 204 });
      } else {
        resolve({ success: true, statusCode: 200 });
      }
    } catch (err) {
      console.log(err);
      reject({ success: false, statusCode: 504, err: err });
    }
  });
};
