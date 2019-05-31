const db = require("../utilites/db");
const pool = require("../utilites/dbPool.js");
const crud = require("../utilites/crud/crud");
const joiValidator = require("joi");
module.exports = class privileges {
  constructor(roleId, roleName) {
    this.roleName = roleName;
  }

  static getRoles() {
    return db.execute(`select role_id as 'id' , name , description from roles`);
  }

  static getRoleById(roleId) {
    return db.execute(
      `select role_id as "id" , name ,description from roles where role_id = ?`,
      [roleId]
    );
  }

  save() {
    return db.execute(`insert into roles(name) values(?)`, [this.roleName]);
  }

  static deleteRole(roleId) {
    return db.execute("delete from roles where role_id = ?", [roleId]);
  }

  static addRoleWithPrivileges() {
    return pool;
  }

  static updateRole(roleId, fieldName, value) {
    return db.execute(`UPDATE  roles set ${fieldName} = ? where role_id = ?`, [
      value,
      roleId
    ]);
  }

  static validate(data, type) {
    let schema;
    if (type == "name") {
      schema = joiValidator.object().keys({
        roleName: joiValidator
          .string()
          .alphanum()
          .min(1)
          .max(100)
          .required()
      });
    }

    if ((type = "id")) {
      schema = joiValidator.object().keys({
        roleId: joiValidator.number().required()
      });
    }

    if (type == "id,name,value") {
      schema = joiValidator.object().keys({
        roleName: joiValidator.number().required(),
        roleId: joiValidator.number().required(),
        value: joiValidator.number().required()
      });
    }

    return joiValidator.validate(data, schema);
  }
};
