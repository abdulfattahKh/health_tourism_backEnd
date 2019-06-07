const validator = require("../utilites/validator");
const Crud = require("../models/crud.model");

module.exports.updateValues = async (req, res, next) => {
  try {
    //let vaidate = await validator(req.body);
    const updateRes = await updateValues(
      req.body.tableName,
      req.body.fieldName,
      req.body.columnName,
      req.body[req.body.columnName],
      req.body.value
    );
    return res.status(updateRes.statusCode).json({
      ...updateRes,
      message: "it was updated successfuly"
    });
  } catch (err) {
    return res.status(500).json({
      ...err,
      message: "error on server"
    });
  }
};

function updateValues(tablName, fieldName, columnName, id, values) {
  return new Promise(async (resolve, reject) => {
    try {
      const saveRes = await Crud.updateValues(
        tablName,
        fieldName,
        columnName,
        id,
        values
      );
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
}
