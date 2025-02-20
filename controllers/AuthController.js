const db = require("../utilites/db");
const User = require("../models/user.model");
const Role = require("../models/Roles.model");
const Crud = require("../controllers/crudController");
const bcrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const check_auth = require("../middleWares/check_authentication");
module.exports.signup = (req, res, next) => {
  //validation
  let result = User.validation(req.body);
  if (result === true) {
    User.getUserByEmail(req.body.email)
      .then(Email => {
        if (Email[0].length !== 0) {
          return res.json({
            success: false,
            message: "this email has already used"
          });
        } else {
          bcrpt
            .hash(req.body.password, 12)
            .then(hashPassword => {
              req.body.password = hashPassword;
              let user = new User(req.body);
              return user.save();
            })
            .then(save_result => {
              return res.json({
                success: true,
                message: "the user information has been saved correctly"
              });
            })
            .catch(err => {
              return res.json({
                success: false,
                message: 'error',
                err: err
              })
            });
        }
      })
      .catch(err => {
        return res.json({
          success: false,
          message: "error",
          err: err
        })
      });
  } else {
    return res.json({
      success: false,
      message: result
    });
  }
};

module.exports.signin = (req, res, next) => {
  if (!req.body.email || req.body.email === "") {
    return res.json({
      success: false,
      message: "email is required"
    });
  }

  if (!req.body.password || req.body.password === "") {
    return res.json({
      success: false,
      message: "password is required"
    });
  }

  if (req.body.password.length < 8) {
    return res.json({
      success: false,
      message: "password must be more than 7 characters"
    });
  }

  User.getUserByEmail(req.body.email)
    .then(result => {
      if (result[0].length !== 0) {
        bcrpt
          .compare(req.body.password, result[0][0].password)
          .then(match => {
            if (match === false) {
              return res.json({
                success: false,
                message: "password dosn't match"
              });
            }
            const token = jwt.sign({
                email: result[0][0].email,
                userId: result[0][0].id,
                roleId: result[0][0].role_id
              },

              "this is a health tourism website", {
                expiresIn: "24h"
              }
            );
            return res.json({
              success: true,
              message: "sign in",
              token: token,
              expiresIn: 3600000,
              user: result[0][0]
            });
          })
          .catch(err => {
            return res.json({
              success: false,
              message: "there is an error"
            });
          });
      } else {
        return res.json({
          success: false,
          message: "the email is not exsist"
        });
      }
    })
    .catch(err => {
      return res.status(400).json({
        success: false,
        message: "error",
        error: err
      })
    });
};

module.exports.update = (req, res, next) => {};

module.exports.checkEmail = (req, res, next) => {
  if (!req.body.email || req.body.email === "") {
    return res.json({
      success: false,
      message: "email is required"
    });
  }
  User.getUserByEmail(req.body.email)
    .then(Email => {
      if (Email[0].length !== 0) {
        return res.json({
          success: false,
          message: "the email is already used"
        });
      } else {
        res.json({
          success: true,
          message: "the email is available"
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAllUsers();
    if (users[0].length == 0) {
      return res.status(302).json({
        success: true,
        message: "there are no data",
        errorCode: 302
      });
    }
    return res.status(200).json({
      success: true,
      message: "users info was fetched correctly",
      errorCode: 200,
      data: users[0]
    });
  } catch (err) {
    return res.status(501).json({
      success: false,
      errorCode: 501,
      message: err
    });
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.getUserById(req.params.id);
    const role = await Role.getRoleById(1);
    user[0][0]["role_id"] = role[0][0];
    return res.status(200).json({
      success: true,
      message: "user info was fethced correctly",
      errorCode: 200,
      data: user[0]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
      errorCode: 500
    });
  }
};

module.exports.getUserInformation = (req, res, next) => {
  const roleId = req.userInformation.roleId;
  User.checkAuthorization(roleId, 1)
    .then(result => {
      if (result[0].length === 0) {
        return res.json({
          success: true,
          message: "you have no authoriziation to access this method"
        });
      }
      const userId = req.userInformation.userId;
      if (userId) {
        return User.getUserById(userId);
      }
    })
    .then(result => {
      if (result[0].length === 0) {
        return res.json({
          success: false,
          message: "this user is not exist"
        });
      }
      return res.json({
        success: true,
        message: "we have found it",
        userinfo: result[0][0]
      });
    })
    .catch(err => {
      return res.json({
        success: false,
        message: "you have no authoriziation to access this method"
      });
    });
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    let validate = await User.validator(req.params, ["id"]);
    let deleteRes = await deleteUser(req.params.id)
      .then(result => {
        if (result) {
          res.status(200).json({
            success: true,
            message: "user was deleted successfuly",
            statusCode: 200
          });
        }
      })
      .catch(err => {
        return res.status(500).json({
          success: false,
          message: err,
          statusCode: 500
        });
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
      statusCode: 500
    });
  }
};

module.exports.updateValues = async (req, res, next) => {
  try {
    let vaidate = await User.validator(req.body, [
      "tableName",
      "value",
      "fieldName",
      "id"
    ]);
    const updateRes = await Crud.updateValues(
      req.body.tableName,
      req.body.fieldName,
      req.body.id,
      req.body.value
    );
    return res.status(updateRes.statusCode).json({
      ...updateRes,
      message: "it was updated successfuly"
    });
  } catch (err) {
    return res.status(500).json({
      ...err,
      message: "error on server"
    });
  }
};

//helper functions
deleteUser = userId => {
  return new Promise(async (resolve, reject) => {
    try {
      let deleteRes = await User.deleteUser(userId);
      if (deleteRes[0].affectedRows > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (err) {
      console.log(err);
      reject("504");
    }
  });
};