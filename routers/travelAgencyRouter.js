const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const roleController = require("../controllers/RolesController");
const travelAgencyController = require("../controllers/travelAgencyController");
const router = express.Router();

/// work yes
// router.post("/:userId", travelAgencyController.addTravel);


// //work yes
// router.put("/:id", travelAgencyController.updateTravel);


// ///work yes
// router.put("/changeStatus/:id", travelAgencyController.changeStatus);



//OK
router.get("/allTravelAgencies", travelAgencyController.getAllTravel);

//OK
router.get("/TravelAgenciesByStatus/", travelAgencyController.getAllTravelByStatus);

router.get("/myTravelAgencies/:userId", travelAgencyController.getMyTravelAgencies);
///OK

router.get('/travelAgencyById/:travelId', travelAgencyController.getTravelAgencyById);

//OK
router.post("/addTravelAgency/:userId", travelAgencyController.addTravel);

//OK
router.put("/editTravel/:id", travelAgencyController.updateTravel);

//OK
router.delete("/deleteTravelAgency/:id", travelAgencyController.deleteTravel);

///
router.delete('/deleteImage/:imageId', travelAgencyController.deleteImage);
//work yes
router.get("/:id", travelAgencyController.getAllTravelById);

router.put(
  '/addDescreption/:travelId',
  // check_auth,
  // check_author([1, 2]),
  travelAgencyController.putAddDescreption
);

router.get(
  '/getDescreption/:travelId',
  // check_auth,
  // check_author([1, 2]),
  travelAgencyController.getDescreption
);

router.post("/addImage/:travelAgencyId", travelAgencyController.postAddImage);

router.get('/getAllImgaesByTravelAgencyId/:travelId', travelAgencyController.getAllImagesByTravelId);


module.exports = router;