const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const roleController = require("../controllers/RolesController");
const travelAgencyController = require("../controllers/travelAgencyController");
const router = express.Router();

/// work
router.post('/:userId',check_auth,check_author(3),travelAgencyController.addTravel)

//work
router.put('/:id',check_auth,check_author(3),travelAgencyController.updateTravel)

///work
router.delete('/:id',check_auth,check_author(3),travelAgencyController.deleteTravel)

///work
router.put('/changeStatus/:id',check_auth,check_author(3),travelAgencyController.changeStatus)

//work
router.get('/',check_auth,check_author(3),travelAgencyController.getAllTravel)

//work
router.get('/:id',check_auth,stravelAgencyController.getAllTravelById)

/// work
router.get('/status/:stat',check_auth,check_author(3),travelAgencyController.getAllTravelByStatus)
   


module.exports = router;
