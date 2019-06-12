const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const roleController = require("../controllers/RolesController");
const tripsController = require("../controllers/tripsController");
const router = express.Router();

router.post('/',tripsController.addTrip)

router.delete('/:id',tripsController.deleteTrip)

router.get('/',tripsController.getAllTrips)

router.get('/:id',tripsController.getTripById)

router.put('/:id',tripsController.updateTrip)

module.exports = router;