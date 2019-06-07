const express = require("express");
const crudController = require("../controllers/crudController");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middlewares/check_authorization");
const router = express.Router();

router.put(
  "/updateValues",
  check_auth,
  check_author([1, 72]),
  crudController.updateValues
);
module.exports = router;
