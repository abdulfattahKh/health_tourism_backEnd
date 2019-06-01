const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const roleController = require("../controllers/RolesController");
const travelAgencyController = require("../controllers/travelAgencyController");
const router = express.Router();

/// work
router.post('/:userId',travelAgencyController.addTravel)

//work
router.put('/:id',travelAgencyController.updateTravel)

///work
router.delete('/:id',travelAgencyController.deleteTravel)

///work
router.put('/changeStatus/:id',travelAgencyController.changeStatus)

//work
router.get('/',travelAgencyController.getAllTravel)

//work
router.get('/:id',travelAgencyController.getAllTravelById)

/// work
router.get('/status/:stat',travelAgencyController.getAllTravelByStatus)
   


module.exports = router;
