const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const roleController = require("../controllers/RolesController");
const tripsController = require("../controllers/tripsController");
const router = express.Router();

router.post('/addTrip/', tripsController.addTrip)

router.post('/addCompleteTrip', tripsController.addCompleteTrip);

router.delete('/deleteTrip/:id', tripsController.deleteTrip)

router.get('/getAllTrips/', tripsController.getAllTrips)

router.get('/getTripById/:id', tripsController.getTripById)

router.put('/updateTrip/:id', tripsController.updateTrip)

module.exports = router;