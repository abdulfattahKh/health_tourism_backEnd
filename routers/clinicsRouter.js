const express = require("express");
const multer = require('multer');
const router = express.Router();
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middlewares/check_authorization");

const clinicsController = require("../controllers/clinicsController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'upload/images/clinics')
  },
  filename: function (req, file, cb) {
      console.log(file.originalname);
      cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({storage: storage});

// done
// router.get(
//   '/allClinics',
//   check_auth,
//   check_author([1]),
//   clinicsController.getAllClinics
//   );

// done
// router.get(
//   '/allClinics/:userId',
//   check_auth,
//   check_author([1]),
//   clinicsController.getAllClinicsOfAnUser
//   );

// done
  router.get(
  "/clinicTypes",
  check_auth,
  check_author([2]),
  clinicsController.getClinicTypes
);

// done
// check for admin authentication
// router.get(
//   "/clinicStatus",
//   check_auth,
//   check_author([1]),
//   clinicsController.getClinicsStatus
// );

router.put(
  '/changeClnincStatus/:clinicId',
  // check_auth,
  // check_author([1]),
  clinicsController.putChangeClinicStatus
);

router.post(
  "/addClinic",
  check_auth,
  check_author([2]),
  clinicsController.addClinic
);


module.exports = router;


