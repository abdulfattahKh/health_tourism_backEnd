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
