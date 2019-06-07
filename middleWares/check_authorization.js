const jwt = require("jsonwebtoken");
module.exports = function HasRole(roles = []) {
  return (req, res, next) => {
    let author = roles.some(role => role == req.userInformation.roleId);
    if (author) {
      next();
    } else {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "you are not autharized"
      });
    }
  };
};
