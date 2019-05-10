const rolesModel = require("../models/Roles.model");

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

module.exports.getMyprivileges = (req, res, next) => {
    const roleId = req.userInformation.roleId;
    rolesModel
        .getMyprivileges(roleId)
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