const express = require('express');
const router = express.Router();

const locationController = require('../controllers/locationController');


router.get('/countries', locationController.getAllCountries);


router.get('/cities', locationController.getAllCitiesByCountryId);


router.get('/states', locationController.getAllStatesByCityId);

module.exports = router ;
