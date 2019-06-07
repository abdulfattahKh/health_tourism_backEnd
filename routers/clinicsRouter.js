const express = require("express");
const router = express.Router();
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middlewares/check_authorization");

const clinicsController = require("../controllers/clinicsController");
router.get(
  "/clinicTypes",
  check_auth,
  check_author([2]),
  clinicsController.getClinicTypes
);

router.get("/getAllClinics", clinicsController.getAllClinics);

// check for admin authentication
router.get(
  "/clinicsStatus",
  check_auth,
  check_author([1]),
  clinicsController.getClinicsStatus
);

router.get(
  "/ClinicsByStatus",
  check_auth,
  check_author([1]),
  clinicsController.getClinicsByStatus
);

router.post(
  "/addClinic",
  check_auth,
  check_author([2]),
  clinicsController.queryAddClinic
);

router.get(
  "/allClinics",
  check_auth,
  check_author([1]),
  clinicsController.getAllClinics
);
router.get(
  "/myClinics/:userId",
  check_auth,
  check_author([1, 2]),
  clinicsController.getMyClinics
);
module.exports = router;
