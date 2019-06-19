const PrivilegesModel = require("../models/Privileges.model");
const validator = require("../utilites/validator");
module.exports.addPrivilege = (req, res, next) => {
  const data = req.body;
  validator(data, ["name", "description"])
    .then(validate_res => {
      let privilege = new PrivilegesModel(req.body.name, req.body.description);
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
      console.log(err);
      res.json({
        success: false,
        message: "try again",
        err: err
      });
    });
};

module.exports.deletePrivilege = (req, res, next) => {
  validator(req.params, ["id"])
    .then(validator_res => {
      PrivilegesModel.deletePervilege(req.params.id)
        .then(delting_res => {
          return res.json({
            success: true,
            message: "it was deleted successfuly"
          });
        })
        .catch(err => {
          return res.status(500).json({
            success: false,
            message: "there was an error",
            err: err
          });
        });
    })
    .catch(err => {
      return res.status(401).json({
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

module.exports.getPrivilegeById = async (req, res, next) => {
  try {
    let validate_res = await validator(req.params, ["id"]);
    let getRes = await PrivilegesModel.getPrivilegeById(req.params.id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "it was fetched correctly",
      data: getRes[0]
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: err
    });
  }
};

module.exports.getAllPrivileges = (req, res, next) => {
  PrivilegesModel.getAllPrivileges()
    .then(privilege_res => {
      console.log(privilege_res)
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

module.exports.addDescriptionColumn = async (req, res, next) => {
  try {
    let addRes = await PrivilegesModel.addDescriptionColumn();
    return res.status(200).json({
      success: true,
      message: "it was added successfuly"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err
    });
  }
};

module.exports.getPrivilegesByRoleId = async (req, res, next) => {
  try {
    let validate = await PrivilegesModel.validate(req.params, "roleId");

    let result = await PrivilegesModel.getPrivilegesByRoleId(validate.roleId);
    // if (result[0].length == 0) {
    //   return res.status(304).json({
    //     errorCode: 304,
    //     success: true,
    //     message: "privileges were not fetched correctly"
    //   });
    // }
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
