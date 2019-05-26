const rolesModel = require("../models/Roles.model");
const privilegeModal = require("../models/Privileges.model");
const crud = require("../utilites/crud/crud");
const pool = require("../utilites/dbPool");

module.exports.getRoles = (req, res, next) => {
  return rolesModel
    .getRoles()
    .then(roles => {
      return res.json({
        success: true,
        message: "roles",
        data: roles[0]
      });
    })
    .catch(err => {
      return res.json({
        success: false,
        message: err
      });
    });
};

//out of service
module.exports.addRole = (req, res, next) => {
  const data = req.body;
  rolesModel
    .validate(data, "name")
    .then(res => {
      let role = new rolesModel(data.roleName);
      return role.save();
    })
    .then(save_res => {
      if (save_res[0].affectedRows) {
        return res.json({
          success: true,
          message: "role was added correctly"
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

module.exports.deleteRole = (req, res, next) => {
  rolesModel
    .validate(req.params, "id")
    .then(validateRes => {
      crud
        .delete("roles", {
          fieldName: "role_id",
          fieldValue: validateRes.roleId
        })
        .then(deleteRes => {
          if (deleteRes[0].affectedRows) {
            return res.json({
              success: true,
              message: "role was deleted"
            });
          }
          return res.json({
            success: false,
            message: `id:${req.body.roleId} is not exist`
          });
        })
        .catch(err => {
          res.json({
            success: false,
            message: "error",
            err: err
          });
        });
    })
    .catch(err => {
      res.json({
        success: false,
        message: "error",
        err: err
      });
    });
};

module.exports.addRoleWithPrivileges = (req, res, next) => {
  const roleName = req.body.name;
  const description = req.body.description;
  const privileges = req.body.privileges;
  rolesModel.addRoleWithPrivileges().getConnection((err, connection) => {
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

module.exports.getRoleById = async (req, res, next) => {
  try {
    let validationRes = await rolesModel.validate(req.params, "id");
    let result = await rolesModel.getRoleById(validationRes.roleId);
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

module.exports.editRole = async (req, res, next) => {
  // console.log(req);
  try {
    //let validate = await rolesModel.validate(req.body, "id,name,value");
    if (req.body.name == "privileges") {
      pool.getConnection((err, connection) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err,
            errorCode: 500
          });
        }
        connection.beginTransaction(err => {
          if (err) {
            connection.rollback(err => {
              connection.release();
              return res.status(500).json({
                success: false,
                message: err,
                errorCode: 500
              });
            });
          } else {
            connection.query(
              `delete from permissions_roles where role_id = ?`,
              [req.body.roleId],
              (err, del_res) => {
                if (err) {
                  connection.rollback(err => {
                    connection.release();
                    return res.status(500).json({
                      success: false,
                      message: err,
                      errorCode: 500
                    });
                  });
                } else {
                  req.body.value.forEach(privilege => {
                    connection.query(
                      `insert into permissions_roles(role_id,permission_id) values(?,?)`,
                      [req.body.roleId, privilege["permission_id"]],
                      (err, insertRes) => {
                        if (err) {
                          connection.rollback(err => {
                            connection.release();
                            return res.status(500).json({
                              success: false,
                              message: err,
                              errorCode: 500
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
                        return res.status(500).json({
                          success: false,
                          message: err,
                          errorCode: 500
                        });
                      });
                    } else {
                      connection.release();
                      return res.status(200).json({
                        success: true,
                        message: "was updated successfuly",
                        errorCode: 200
                      });
                    }
                  });
                }
              }
            );
          }
        });
      });
    } else {
      let updateRes = await rolesModel.updateRole(
        req.body.roleId,
        req.body.name,
        req.body.value
      );
      if (updateRes.affectedRows == 0) {
        return res.status(404).json({
          errorCode: 304,
          message: "nothing was updated",
          success: false
        });
      }
      return res.status(200).json({
        errorCode: 200,
        message: "value updated successfuly",
        success: true
      });
    }
  } catch (err) {
    return res.status(400).json({
      errorCode: 400,
      message: err,
      success: false
    });
  }
};
