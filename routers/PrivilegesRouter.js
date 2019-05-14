const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const PrivilegesController = require("../controllers/PrivilegesController");
const Router = express.Router();

Router.get("/myPrivileges", check_auth, PrivilegesController.getMyprivileges);
Router.post(
  "/addPrivilege",
  check_auth,
  check_author(1),
  PrivilegesController.addPrivilege
);
module.exports = Router;
