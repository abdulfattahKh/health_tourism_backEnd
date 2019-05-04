const jwt = require("jsonwebtoken");
module.exports = function HasRole(role) {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const decodeToken = jwt.verify(token, "this is a health tourism website");
      if (decodeToken.roleId == role) {
        next();
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "you have no auth to requrest this http"
      });
    }
  };
};
