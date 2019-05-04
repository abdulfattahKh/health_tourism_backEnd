const express = require("express");
const db = require("../utilites/db");
const check_auth = require("../middleWares/check_authentication");
const hasRole = require("../middleWares/check_authorization");
const router = express.Router();

const userController = require("../controllers/AuthController");
router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get(
  "/userInformation",
  check_auth,
  hasRole(1),
  userController.getUserInformation
);
router.post("/checkEmail", userController.checkEmail);
module.exports = router;
