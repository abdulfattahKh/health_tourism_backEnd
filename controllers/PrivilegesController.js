const PrivilegesModel = require("../models/Privileges.model");
module.exports.addPrivilege = (req, res, next) => {
  const data = req.body;
  PrivilegesModel.validate(data, "add")
    .then(validate_res => {
      let privilege = new PrivilegesModel(req.body.privilegeName);
      return privilege.save();
    })
    .then(save_res => {
      if (save_res[0].affectedRows) {
        return res.json({
          success: true,
          message: "privilege was added correctly"
        });
      }
      return res.json({
        success: false,
        message: "try again"
      });
    })
    .catch(err => {
      res.json({
        success: false,
        message: "try again",
        err: err
      });
    });
};

module.exports.deletePrivilege = (req, res, next) => {
  PrivilegesModel.validate(req.body, "delete")
    .then(validator_res => {
      PrivilegesModel.deletePervilege(req.body.privilegeId)
        .then(delting_res => {
          return res.json({
            success: true,
            message: "it was deleted successfuly"
          });
        })
        .catch(err => {
          return res.json({
            success: false,
            message: "there was an error",
            err: err
          });
        });
    })
    .catch(err => {
      return res.json({
        success: false,
        message: "error with permission",
        err: err
      });
    });
};

module.exports.getMyprivileges = (req, res, next) => {
  const roleId = req.userInformation.roleId;
  PrivilegesModel.getMyprivileges(roleId)
    .then(privileges => {
      if (privileges[0].length != 0) {
        return res.status(200).json({
          success: true,
          message: "my privileges",
          data: privileges[0]
        });
      } else {
        return res.json({
          success: true,
          message: "you have no privileges",
          data: []
        });
      }
    })
    .catch(err => {
      return res.json({
        success: false,
        message: err
      });
    });
};

module.exports.getAllPrivileges = (req, res, next) => {
  PrivilegesModel.getAllPrivileges()
    .then(privilege_res => {
      if (privilege_res[0].length == 0) {
        return res.status(204).json({
          success: true,
          message: "there is no privileges"
        });
      }
      return res.status(200).json({
        success: true,
        message: "got all privileges",
        data: privilege_res[0]
      });
    })
    .catch(err => {
      return res.status(404).json({
        success: false,
        message: "error with privileges",
        err: err
      });
    });
};

module.exports.addRoleWithPrivileges = (req, res, next) => {
  const roleName = req.body.name;
  const description = req.body.description;
  const privileges = req.body.privileges;
  PrivilegesModel.addRoleWithPrivileges().getConnection((err, connection) => {
    connection.beginTransaction(function(err) {
      if (err) {
        connection.rollback(function() {
          connection.release();
          return res.status(404).json({
            success: false,
            errorCode: 404,
            message: "connection faild"
          });
        });
      } else {
        connection.query(
          "INSERT INTO roles (name,description) values(?,?)",
          [roleName, description],
          function(err, results) {
            if (err) {
              connection.rollback(function() {
                connection.release();
                return res.status(404).json({
                  success: false,
                  errorCode: 404,
                  message: err
                });
              });
            } else {
              if (!results.insertId || results.insertId == 0) {
                connection.rollback(err => {
                  if (err) {
                    connection.release();
                    return res.status(404).json({
                      success: false,
                      errorCode: 404,
                      message: err
                    });
                  }
                });
              } else {
                privileges.forEach(privilege => {
                  connection.query(
                    `insert into permissions_roles(permission_id,role_id) values(?,?)`,
                    [privilege, results.insertId],
                    (err, privilege_res) => {
                      if (err) {
                        connection.rollback(err => {
                          connection.release();
                          return res.status(404).json({
                            success: false,
                            errorCode: 404,
                            message: err
                          });
                        });
                      }
                    }
                  );
                });
                connection.commit(err => {
                  if (err) {
                    connection.rollback(err => {
                      connection.release();
                      return res.status(404).json({
                        success: false,
                        errorCode: 404,
                        message: err
                      });
                    });
                  } else {
                    return res.status(200).json({
                      success: true,
                      errorCode: 200,
                      message: "roles and privileges were added successfuly"
                    });
                  }
                });
              }
            }
          }
        );
      }
    });
  });
};

module.exports.getPrivilegesByRoleId = async (req, res, next) => {
  try {
    let validate = await PrivilegesModel.validate(
      req.params,
      "getPrivilegeByRoleId"
    );
    let result = await PrivilegesModel.getPrivilegesByRoleId(validate.roleId);
    if (result[0].length == 0) {
      return res.status(304).json({
        errorCode: 304,
        success: false,
        message: "privileges were not fetched correctly"
      });
    }
    return res.status(200).json({
      errorCode: 200,
      success: true,
      message: "privileges ere fetched correctly",
      data: result[0]
    });
  } catch (err) {
    return res.status(404).json({
      errorCode: 404,
      success: false,
      message: err
    });
  }
};
