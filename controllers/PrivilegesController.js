const PrivilegesModel = require("../models/Privileges.model");

module.exports.addPrivilege = (req, res, next) => {
  const data = req.body;
  PrivilegesModel.validatePermission(data)
    .then(res => {
      let privilege = new rolesModel(data.permissionId, data.permissionName);
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

module.exports.getMyprivileges = (req, res, next) => {
  const roleId = req.userInformation.roleId;
  PrivilegesModel.getMyprivileges(roleId)
    .then(privileges => {
      if (privileges[0].length != 0) {
        return res.json({
          success: true,
          message: "my privileges",
          data: privileges[0]
        });
      } else {
        return res.json({
          success: true,
          message: "you have no privileges",
          privileges: []
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
