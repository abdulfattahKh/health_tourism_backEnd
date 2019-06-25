const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const reviewControler = require('../controllers/reviewControler')
const ReviewsModel = require('../models/reviewsModel');
const router = express.Router();


router.post('/:userId',reviewControler.addReview);

router.put('/:id',reviewControler.updateReview)

router.delete('/:reviewId',reviewControler.deleteReview);

router.get('/',reviewControler.getAllreviews);

router.get('/general',reviewControler.getGeneralReviews);
//reviews all the site 

router.get('/clinics/:clinicId',reviewControler.getClinicReviews);

router.get('/travelAgency/:travelAgencyId',reviewControler.getTravelAgencyReviews);



module.exports = router;