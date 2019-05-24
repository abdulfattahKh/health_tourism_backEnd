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

//out of service
module.exports.addRole = (req, res, next) => {
  const data = req.body;
  rolesModel
    .validate(data, "add")
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
    .validate(req.params, "delete")
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

module.exports.getRoleById = async (req, res, next) => {
  try {
    let validationRes = await rolesModel.validate(req.params, "get");
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
