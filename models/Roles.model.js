const db = require("../utilites/db");
module.exports = class privileges {
  constructor() {}

  static getRoles() {
    return db.execute(`select role_id , name from roles`);
  }

  static getMyprivileges(roleId) {
    return db.execute(
      `
    select roles.role_id, roles.name,permissions.permission_id,permissions.name 
    from roles 
      inner join permissions_roles on roles.role_id = permissions_roles.role_id
      inner join permissions on permissions.permission_id = permissions_roles.permission_id
      where roles.role_id = ?
      ;`,
      [roleId]
    );
  }
};
