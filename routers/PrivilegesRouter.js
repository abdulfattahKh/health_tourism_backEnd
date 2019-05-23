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
Router.post(
  "/deletePrivilege",
  check_auth,
  check_author(1),
  PrivilegesController.deletePrivilege
);

Router.post(
  "/addRoleWithPrivileges",
  check_auth,
  check_author(1),
  PrivilegesController.addRoleWithPrivileges
);
Router.get(
  "/getAllPrivileges",
  check_auth,
  check_author(1),
  PrivilegesController.getAllPrivileges
);
module.exports = Router;
