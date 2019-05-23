const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const roleController = require("../controllers/RolesController");
const router = express.Router();

router.get("/roles", roleController.getRoles);
router.post("/addRole", check_auth, check_author(1), roleController.addRole);
router.delete(
  "/deleteRole/:roleId",
  check_auth,
  check_author(1),
  roleController.deleteRole
);
module.exports = router;
