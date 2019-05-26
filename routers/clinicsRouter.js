const express = require('express');
const router = express.Router();
const check_auth = require('../middleWares/check_authentication');
const check_author = require('../middlewares/check_authorization');


const clinicsController = require('../controllers/clinicsController');

router.get('/clinicTypes', check_auth, check_author(2), clinicsController.getClinicTypes);

// check for admin authentication
router.get('/clinicsStatus', check_auth, check_author(1), clinicsController.getClinicsStatus);



module.exports = router;