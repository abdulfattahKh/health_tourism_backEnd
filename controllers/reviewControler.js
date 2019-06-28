const db = require('../utilites/db')
const ReviewsModel = require('../models/reviewsModel');


module.exports.addReview = (req, res, next) => {
    review = new ReviewsModel(req.body, req.params.userId);
    review.save()
        .then(result => {
            ReviewsModel.getReviewById(result[0].insertId)
                .then(row => {
                    res.status(200).json({
                        success: true,
                        data: row[0]
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        success: false,
                        data: err
                    })
                })

            console.log(result);
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                data: `internal error please try again :( .`
            })
        })

}



module.exports.updateReview = (req, res, next) => {
    review = new ReviewsModel(req.body, req.body.userId);
    review.update(req.params.id)
        .then(result => {
            res.status(200).json({
                success: true,
                data: `review updated correctly :) .`
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                data: `internal error please try again :( .`
            })
        })
}

module.exports.deleteReview = (req, res, next) => {
    let userId = req.userInformation.userId;
    ReviewsModel.delete(req.params.reviewId, userId)
        .then(result => {
            res.status(200).json({
                success: true,
                data: `review deleted correctly :) .`
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                data: `internal error please try again :( .`
            })
        })
}

module.exports.getAllreviews = (req, res, next) => {
    ReviewsModel.getAllReviews()
        .then(result => {
            res.status(200).json({
                success: true,
                data: result[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                data: `internal error please try again :( .`
            })
        })
}


module.exports.getGeneralReviews = (req, res, next) => {
    ReviewsModel.getGeneralReviews()
        .then(result => {
            res.status(200).json({
                success: true,
                data: result[0]
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                data: `internal error please try again :( .`
            })
        })
}



module.exports.getClinicReviews = (req, res, next) => {
    ReviewsModel.getClinicReviews(req.params.clinicId)
        .then(result => {
            res.status(200).json({
                success: true,
                data: result[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                data: `internal error please try again :( .`
            })
        })
}



module.exports.getTravelAgencyReviews = (req, res, next) => {
    ReviewsModel.getTravelAgencyReviews(req.params.travelAgencyId)
        .then(result => {
            res.status(200).json({
                success: true,
                data: result[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                data: `internal error please try again :( .`
            })
        })
}