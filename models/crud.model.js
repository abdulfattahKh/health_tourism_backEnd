const db = require("../utilites/db");
const joi = require("joi");
module.exports.updateValues = (tableName, fieldName, id, value) => {
  console.log(id);
  console.log(value);
  return db.execute(
    `update ${tableName} set ${fieldName} = ? where id= ${id}`,
    [value]
  );
};

// module.exports.validator = (types = [])=>{
//     let schema = joi.object().keys({});
//     types.forEach(type=>{
//         if(type == 'fieldName') {

//         }
//     })
// }
