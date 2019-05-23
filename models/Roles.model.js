const db = require("../utilites/db");
const crud = require("../utilites/crud/crud");
const joiValidator = require("joi");
module.exports = class privileges {
  constructor(roleId, roleName) {
    this.roleName = roleName;
  }

  static getRoles() {
    return db.execute(`select role_id as 'id' , name from roles`);
  }

  save() {
    return db.execute(`insert into roles(name) values(?)`, [this.roleName]);
  }

  static deleteRole(roleId) {
    return db.execute("delete from roles where role_id = ?", [roleId]);
  }

  static validateRole(data) {
    const schema = joiValidator.object().keys({
      roleName: joiValidator
        .string()
        .alphanum()
        .min(1)
        .max(100)
        .required()
    });
    return joiValidator.validate(data, schema);
  }

  static deleteRoleValidator(data) {
    const schema = joiValidator.object().keys({
      roleId: joiValidator.number().required()
    });
    return joiValidator.validate(data, schema);
  }
};
