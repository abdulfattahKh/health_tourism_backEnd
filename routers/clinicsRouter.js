const express = require("express");
const multer = require("multer");
const router = express.Router();
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middlewares/check_authorization");

const clinicsController = require("../controllers/clinicsController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/images/clinics");
  },
  filename: function (req, file, cb) {
    console.log(file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get(
  "/clinicTypes",
  check_auth,
  check_author([1, 2]),
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

// done
router.put(
  '/changeClnincStatus/:clinicId',
  clinicsController.putChangeClinicStatus
);

router.get("/allClinics", clinicsController.getAllClinics);

router.get(
  "/myClinics/:userId",
  check_auth,
  check_author([1, 2]),
  clinicsController.getMyClinics
);
router.get(
  "/ClinicsByStatus",
  check_auth,
  check_author([1]),
  clinicsController.getClinicsByStatus
);

// done
router.delete(
  '/deleteClinic/:clinicId',
  check_auth,
  check_author([1]),
  clinicsController.deleteClinicById
);

router.post(
  "/addClinic",
  // check_auth,
  // check_author([2]),
  clinicsController.postAddClinic
);

router.get('/clinicById/:id',clinicsController.getClinicById);

router.get('/clinicTypesById/:id',clinicsController.getClinicTypesById);
router.put(
  '/addDescreption',
  clinicsController.putAddDescreption
);
router.post(
  '/addImage',
  upload.array('image'),
  // check_auth,
  // check_author([2]),
  clinicsController.postAddImages
);

router.delete(
  '/deleteImage/:imageId',
  // check_auth,
  // check_author([2]),
  clinicsController.deleteImageById
);

router.post(
  '/addCurrency',
  clinicsController.postAddCurrency
);

router.delete(
  '/deleteCurrency',
  check_auth,
  check_author([2]),
  clinicsController.deleteCurrency
);

router.put(
  '/editCurrency',
  check_auth,
  check_author([1,2]),
  clinicsController.updateCurrency
);

router.get(
  '/getClinicCountry/:clinicId',
  check_auth,
  check_author([1,2]),
  clinicsController.getClinicCountry
);

router.get(
  '/getClinicCity/:clinicId',
  check_auth,
  check_author([1,2]),
  clinicsController.getClinicCity
);

router.get(
  '/getClinicState/:clinicId',
  check_auth,
  check_author([1,2]),
  clinicsController.getClinicState
);


router.get(
  '/getDescreption/:clinicId',
  check_auth,
  check_author([1,2]),
  clinicsController.getDescreption
);

module.exports = router;
