const db = require("../utilites/db");
const joiValidator = require("joi");
module.exports = class privileges {
  constructor(privilegeId, privilegeName) {
    this.privilegeId = privilegeId;
    this.privilegeName = privilegeName;
  }

  save() {
    return db.execute(
      `insert into permissions(permission_id,name) values(?,?)`,
      [this.privilegeId, this.privilegeName]
    );
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

  save() {
    return db.execute(
      `insert into permissions(permission_id , name) values(?,?)`,
      [this.permissionId, this.permissionName]
    );
  }

  static deleteRole(roleId) {
    return db.execute("delete from roles where role_id = ?", [roleId]);
  }

  static validatePermission(data) {
    const schema = joiValidator.object().keys({
      permissionName: joiValidator
        .string()
        .alphanum()
        .min(1)
        .max(100)
        .required(),
      permissionId: joiValidator.number().required()
    });
    return joiValidator.validate(data, schema);
  }
};
