const hotelModel = require('../models/hotelsModel');
const connection = require('../utilites/db');
const imagesController = require('../controllers/imagesController');
exports.addHotel = (req, res, next) => {

}


//add hotel
exports.addHotelWithPhotos = (values) => {
    return new Promise((resolve, reject) => {
        let images = values.hotelImages;
        let generalInfo = values.hotelInfo;
        let hotelId;
        connection.beginTransaction()
            .then(result => {
                return this.addHotelFunction(generalInfo);
            })
            .then(generalInfoResult => {
                hotelId = generalInfoResult.insertId;
                return imagesController.addImagesById({
                    hotelId: hotelId,
                    array: images
                });
            })
            .then(imagesResult => {
                resolve({
                    success: true,
                    message: 'hotel was added',
                    hotelId: hotelId
                })
            })
            .catch(err => {
                connection.rollback();
                reject({
                    success: false,
                    message: 'error',
                    err
                })
            })
    })
}

exports.addHotelFunction = values => {
    return new Promise((resolve, reject) => {
        let hotel = new hotelModel(values);
        hotel.save()
            .then(result => {
                resolve({
                    success: true,
                    message: "hotel was added correctly",
                    insertId: result[0].insertId
                })
            })
            .catch(err => {
                connection.rollback();
                reject({
                    success: false,
                    message: "error",
                    err
                })
            })

    })
}

exports.addTripHotel = (tripId, hotelId) => {
    return new Promise((resolve, reject) => {
        hotelModel.addTripHotel(tripId, hotelId)
            .then(result => {
                resolve({
                    success: true,
                    message: "added hotel trip"
                })
            })
            .catch(err => {
                reject({
                    success: false,
                    message: 'error with adding hotel trip',
                    err
                })
            })
    })
}