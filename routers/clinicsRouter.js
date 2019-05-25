const express = require('express');
const router = express.Router();
const check_auth = require('../middleWares/check_authentication');
const check_author = require('../middlewares/check_authorization');


const clinicsController = require('../controllers/clinicsController');
router.get('/clinicTypes', check_auth, check_author(2), clinicsController.getClinicTypes);
router.post('/addClinic', check_auth, check_author(2), clinicsController.postAddClinic);