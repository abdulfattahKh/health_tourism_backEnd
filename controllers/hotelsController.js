const hotelModel = require('../models/hotelsModel');
const connection = require('../utilites/db');
const imagesController = require('../controllers/imagesController');
exports.addHotel = (req, res, next) => {

}


//add hotel
exports.addHotelWithPhotos = (values) => {
    return new Promise((resolve, reject) => {
        let images = values.images;
        let generalInfo = values.generalInfo;

        connection.beginTransaction()
            .then(result => {
                return this.addHotelFunction(generalInfo);
            })
            .then(generalInfoResult => {
                return imagesController.addImagesById({
                    hotelId: generalInfoResult.insertId,
                    array: images
                });
            })
            .then(imagesResult => {
                connection.commit();
                connection.release();
                resolve({
                    success: true,
                    message: 'hotel was added',
                })
            })
            .catch(err => {
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
                reject({
                    success: false,
                    message: "error"
                })
            })

    })
}