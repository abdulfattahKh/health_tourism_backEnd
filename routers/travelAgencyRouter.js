const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const roleController = require("../controllers/RolesController");
const travelAgencyController = require("../controllers/travelAgencyController");
const router = express.Router();



router.post('/:userId',travelAgencyController.addTravel)

router.put('/:id',travelAgencyController.updateTravel)

router.delete('/:id',travelAgencyController.deleteTravel)

router.put('/changeStatus/:id',check_auth,check_author(3),travelAgencyController.changeStatus)

router.get('/',check_auth,check_author(3),travelAgencyController.getAllTravel)

router.get('/status/:stat',check_auth,check_author(3),travelAgencyController.getAllTravelByStatus)



module.exports = router;