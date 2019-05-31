const express = require("express");
const db = require("../utilites/db");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const router = express.Router();

const userController = require("../controllers/AuthController");
router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get(
  "/userById/:id",
  check_auth,
  check_author([1]),
  userController.getUserById
);
router.delete(
  "/delete/:id",
  check_auth,
  check_author([1]),
  userController.deleteUser
);
router.put(
  "/updateValues",
  check_auth,
  check_author([1, 72]),
  userController.updateValues
);
router.get("/allUsers", check_auth, userController.getAllUsers);
// router.get(
//   "/userInformation",
//   check_auth,
//   hasRole(1),
//   userController.getUserInformation
// );
router.post("/checkEmail", userController.checkEmail);
module.exports = router;
