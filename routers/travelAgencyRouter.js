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
// router.delete("/:id", travelAgencyController.deleteTravel);

// ///work yes
// router.put("/changeStatus/:id", travelAgencyController.changeStatus);

// //work yes
// router.get("/:id", travelAgencyController.getAllTravelById);

// /// work yes
router.get("/TravelAgenciesByStatus/", travelAgencyController.getAllTravelByStatus);

///
router.post("/addImage/:travelAgencyId", travelAgencyController.postAddImage);

///
router.delete('/deleteImage/:imageId', travelAgencyController.deleteImage);

//work yes
router.get("/",travelAgencyController.getAllTravel);
module.exports = router;