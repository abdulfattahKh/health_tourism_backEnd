const express = require('express');
const router = express.Router();

const locationController = require('../controllers/locationController');


router.get('/countries', locationController.getAllCountries);


router.get('/cities/:countryId', locationController.getAllCitiesByCountryId);


router.get('/states/:countryId/:cityId', locationController.getAllStatesByCityId);

module.exports = router ;
