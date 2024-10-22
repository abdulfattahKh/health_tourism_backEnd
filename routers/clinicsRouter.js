const express = require("express");
const multer = require("multer");
const router = express.Router();
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middlewares/check_authorization");

const clinicsController = require("../controllers/clinicsController");
const doctorController = require('../controllers/doctorController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/images/clinics");
  },
  filename: function (req, file, cb) {
    console.log(file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage
});

router.post(
  '/addApplication/:userId',
  check_auth,
  check_author([1, 4]),
  clinicsController.addRequestOfTreatment
);

router.post(
  '/getApplications',
  check_auth,
  check_author([1, 2]),
  clinicsController.getAllRequestOfClinic
);

router.delete(
  `/deleteApplication/:applicationId`,
  check_auth,
  check_author([1, 2]),
  clinicsController.deleteApplication
);






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
router.get(
  '/changeClnincStatus/:clinicId',
  check_auth,
  check_author([1, 2]),
  clinicsController.putChangeClinicStatus
);

router.get(
  "/allClinics",
  check_auth,
  check_author([1, 2]),
  clinicsController.getAllClinics
);

router.get(
  "/myClinics/:userId",
  check_auth,
  check_author([1, 2]),
  clinicsController.getMyClinics
);
router.get(
  "/ClinicsByStatus",
  check_auth,
  check_author([1, 2]),
  clinicsController.getClinicsByStatus
);

// done
router.delete(
  '/deleteClinic/:clinicId',
  check_auth,
  check_author([1, 2]),
  clinicsController.deleteClinicById
);

router.post(
  "/addClinic",
  // check_auth,
  // check_author([1, 2]),
  clinicsController.postAddClinic
);

router.get(
  '/clinicById/:id',
  check_auth,
  check_author([1, 2]),
  clinicsController.getClinicById
);

router.get(
  '/clinicTypesById/:id',
  check_auth,
  check_author([1, 2]),
  clinicsController.getClinicTypesById
);

router.put(
  '/addDescreption/:clinicId',
  check_auth,
  check_author([1, 2]),
  clinicsController.putAddDescreption
);

router.post(
  '/addImage/:clinicId',
  upload.array('image'),
  check_auth,
  check_author([1, 2]),
  clinicsController.postAddImages
);

router.delete(
  '/deleteImage/:imageId',
  check_auth,
  check_author([1, 2]),
  clinicsController.deleteImageById
);

router.get(
  '/getCurrencies/:clinicId',
  check_auth,
  check_author([1, 2]),
  clinicsController.getAllCurrenciesById
);

router.get(
  '/getAllCurrencies',
  check_auth,
  check_author([1, 2]),
  clinicsController.getAllCurrencies
);

router.post(
  '/addCurrency/:clinicId',
  check_auth,
  check_author([1, 2]),
  clinicsController.updateCurrency
);

router.delete(
  '/deleteCurrency/:currencyId',
  check_auth,
  check_author([1, 2]),
  clinicsController.deleteCurrency
);

router.put(
  '/editCurrency/:currencyId',
  check_auth,
  check_author([1, 2]),
  clinicsController.updateCurrency
);

router.get(
  '/getClinicCountry/:clinicId',
  check_auth,
  check_author([1, 2]),
  clinicsController.getClinicCountry
);

router.get(
  '/getClinicCity/:clinicId',
  check_auth,
  check_author([1, 2]),
  clinicsController.getClinicCity
);

router.get(
  '/getClinicState/:clinicId',
  check_auth,
  check_author([1, 2]),
  clinicsController.getClinicState
);


router.get(
  '/getDescreption/:clinicId',
  check_auth,
  check_author([1, 2]),
  clinicsController.getDescreption
);

router.get(
  '/getDoctor/:doctorId',
  check_auth,
  check_author([1, 2]),
  doctorController.getDoctorById
);

router.post(
  '/addDoctor/:clinicId',
  check_auth,
  check_author([1, 2]),
  doctorController.addDoctor
);

router.delete(
  '/deleteDoctor/:doctorId',
  check_auth,
  check_author([1, 2]),
  doctorController.deleteDoctor
);

router.put(
  '/editDoctor/:doctorId',
  check_auth,
  check_author([1, 2]),
  doctorController.updateDoctor
);

router.get(
  '/images/:clinicId',
  check_auth,
  check_author([1, 2]),
  clinicsController.getAllImagesByClinicId
);

router.post(
  '/addExperinces/:doctorId',
  check_auth,
  check_author([1, 2]),
  doctorController.postAddExperincesToDoctor
);

router.get(
  '/doctors/:clinicId',
  check_auth,
  check_author([1, 2]),
  doctorController.getAllDoctorsByClinicId
);

router.post(
  '/doctor/addImage/:doctorId',
  check_auth,
  check_author([1, 2]),
  doctorController.postAddImage
);

router.delete(
  '/doctor/deleteImage/:doctorId',
  check_auth,
  check_author([1, 2]),
  doctorController.deleteImage
);

router.put(
  '/editClinic/:clinicId',
  check_auth,
  check_author([1, 2]),
  clinicsController.putUpdateClinic
);

router.post(
  '/addRequest/:userId',
  check_auth,
  check_author([1, 2]),
  clinicsController.addRequestOfTreatment
);

router.get(
  '/myTreatmentRequests/:clinic_id',
  check_auth,
  check_author([1, 2]),
  clinicsController.getAllRequest
);

router.get(
  '/getTreatmentRequests',
  check_auth,
  check_author([1, 2]),
  clinicsController.getAllRequest
);

router.post('/search', clinicsController.search);

module.exports = router;