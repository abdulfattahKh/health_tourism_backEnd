const db = require("../utilites/db");
const joiValidator = require("joi");
module.exports = class privileges {
  constructor(privilegeName) {
    this.privilegeName = privilegeName;
  }

  save() {
    return db.execute(`insert into permissions(name) values(?)`, [
      this.privilegeName
    ]);
  }

  static getMyprivileges(roleId) {
    return db.execute(
      `
        select permissions.permission_id,permissions.name 
        from permissions 
          inner join permissions_roles on permissions.permission_id = permissions_roles.permission_id
          where permissions_roles.role_id = ?
          ;`,
      [roleId]
    );
  }

  // static deletePervilege(privilegeId) {
  //   return db.execute("delete from roles where role_id = ?", [privilegeId]);
  // }

  static validate(data, type) {
    let schema;
    if (type == "add") {
      schema = joiValidator.object().keys({
        privilegeName: joiValidator.string().required()
      });
    }

    if (type == "delete") {
      schema = joiValidator.object().keys({
        privilegeId: joiValidator.number().required()
      });
    }

    return joiValidator.validate(data, schema);
  }
};
