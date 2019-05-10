const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const roleController = require("../controllers/RolesController");
const router = express.Router();


router.get('/roles',roleController.getRoles)
router.get("/myPrivileges",check_auth,roleController.getMyprivileges);

module.exports = router;
