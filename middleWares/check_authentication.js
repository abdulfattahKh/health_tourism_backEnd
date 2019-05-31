const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodeToken = jwt.verify(token, "this is a health tourism website");
    req.userInformation = {
      userId: decodeToken.userId,
      email: decodeToken.email,
      roleId: decodeToken.roleId
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "you have no auth to requrest this http"
    });
  }
};
