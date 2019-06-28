const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const reviewControler = require('../controllers/reviewControler')
const ReviewsModel = require('../models/reviewsModel');
const router = express.Router();


router.post('/:userId', check_auth, reviewControler.addReview);

router.put('/:id', check_auth, reviewControler.updateReview)

router.delete('/:reviewId', check_auth, reviewControler.deleteReview);

router.get('/', check_auth, reviewControler.getAllreviews);

router.get('/general', check_auth, reviewControler.getGeneralReviews);
//reviews all the site 

router.get('/clinics/:clinicId', check_auth, reviewControler.getClinicReviews);

router.get('/travelAgency/:travelAgencyId', check_auth, reviewControler.getTravelAgencyReviews);



module.exports = router;