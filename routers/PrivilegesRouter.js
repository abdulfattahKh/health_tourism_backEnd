const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const PrivilegesController = require("../controllers/PrivilegesController");
const Router = express.Router();

Router.get("/myPrivileges", check_auth, PrivilegesController.getMyprivileges);

Router.post(
  "/addPrivilege",
  check_auth,
  check_author([1]),
  PrivilegesController.addPrivilege
);
Router.delete(
  "/deletePrivilege/:id",
  check_auth,
  check_author([1]),
  PrivilegesController.deletePrivilege
);

Router.get(
  "/getAllPrivileges",
  check_auth,
  check_author([1]),
  PrivilegesController.getAllPrivileges
);

Router.get(
  "/privilegeById/:id",
  check_auth,
  check_author([1]),
  PrivilegesController.getPrivilegeById
);

Router.get(
  "/addDescriptionColumn",
  check_auth,
  check_author([1]),
  PrivilegesController.addDescriptionColumn
);

Router.get(
  "/privilegeByRoleId/:roleId",
  check_auth,
  check_author([1]),
  PrivilegesController.getPrivilegesByRoleId
);
module.exports = Router;
