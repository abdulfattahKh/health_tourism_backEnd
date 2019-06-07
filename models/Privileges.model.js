const db = require("../utilites/db");
const pool = require("../utilites/dbPool.js");
const joiValidator = require("joi");

module.exports = class privileges {
  constructor(privilegeName, description) {
    this.privilegeName = privilegeName;
    this.description = description;
  }

  save() {
    return db.execute(`insert into permissions(name,description) values(?,?)`, [
      this.privilegeName,
      this.description
    ]);
  }

  static addPrivilegeRelatedToRole(roleId, permissionId) {
    return db.execute(
      `insert into permissions_roles(role_id,permission_id) values(?,?)`,
      [roleId, permissionId]
    );
  }

  static addRoleWithPrivileges() {
    return pool;
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

  static getPrivilegesByRoleId(roleId) {
    return db.execute(
      `select * from permissions inner join permissions_roles on permissions.permission_id = 
      permissions_roles.permission_id where role_id = ?`,
      [roleId]
    );
  }

  static getAllPrivileges() {
    return db.execute(
      `select permission_id as 'id',name ,description from permissions`
    );
  }

  static getPrivilegeById(privilegeId) {
    return db.execute(
      `select permission_id as 'id',name,description from permissions where permission_id = ?`,
      [privilegeId]
    );
  }

  static deletePrivilegesByRoleId(roleId) {
    return db.execute(`delete from permissions_roles where role_id = ?`, [
      roleId
    ]);
  }

  static deletePervilege(privilegeId) {
    return db.execute("delete from permissions where permission_id = ?", [
      privilegeId
    ]);
  }

  static editPrivilege(privilegeId) {
    // return db.execute('update permissions ')
  }

  static addDescriptionColumn() {
    return db.execute(`ALTER TABLE  permissions ADD description varchar(255)`);
  }
  // static deletePervilege(privilegeId) {
  //   return db.execute("delete from roles where role_id = ?", [privilegeId]);
  // }

  static validate(data, type) {
    let schema;

    if (type == "name") {
      schema = joiValidator.object().keys({
        privilegeName: joiValidator.string().required()
      });
    }

    if (type == "id") {
      schema = joiValidator.object().keys({
        privilegeId: joiValidator.number().required()
      });
    }

    if (type == "roleId") {
      schema = joiValidator.object().keys({
        roleId: joiValidator.number().required()
      });
    }

    return joiValidator.validate(data, schema);
  }
};
