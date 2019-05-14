const rolesModel = require("../models/Roles.model");
const crud = require("../utilites/crud/crud");
const joiValidator = require("joi");
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

module.exports.addRole = (req, res, next) => {
  const data = req.body;
  rolesModel
    .validateRole(data)
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
    .deleteRoleValidator(req.body)
    .then(validateRes => {
      console.log(validateRes);
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
