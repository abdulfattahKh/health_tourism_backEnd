const connection = require('../utilites/db')
const tripsModel = require('../models/tripsModel')
const imagesController = require('../controllers/imagesController');

module.exports.addTrip = (req, res, next) => {
  const trip = new tripsModel(req);
  trip.save()
    .then(resule => {
      return res.json({
        success: true,
        message: "trip added correctly"
      })
    })
    .catch(err => {
      return res.json({
        success: false,
        message: "try again"
      });
    })
}


module.exports.addCompleteTrip = (req, res, next) => {
  let tripId;
  let TravelAgencyId = req.body.TravelAgencyId;
  let tripGeneralInformation = req.body.tripGeneralInformation;
  let tripImages = req.body.tripImages;
  let hotelInfo = req.body.hotelInfo;
  // console.log(tripGeneralInformation,tripImages,hotelInfo);
  if (!tripGeneralInformation || !tripImages || !hotelInfo) {
    return res.status(400).json({
      success: false,
      message: "bad requrest"
    })
  }
  connection.beginTransaction()
    .then(result => {
      if (!result) {
        connection.rollback(err => {
          return res.status(500).json({
            success: false,
            message: "transaction faild"
          })
        });
      }
      return addTripHelperFunction(tripGeneralInformation, TravelAgencyId);
    })
    .then(tripResult => {
      tripId = tripResult['insertId'];
      return imagesController.addImagesById({
        tripId,
        array: tripImages
      })
    })
    .then(tripImagesResult => {

      connection.commit();
      return res.status(200).json({
        success: true,
        message: "images and general trip info"
      })
    })
    .catch(err => {

      return res.status(500).json({
        success: false,
        message: 'error',
        err
      })
    })
}


module.exports.deleteTrip = (req, res, next) => {
  tripsModel.delete(req.params.id)
    .then(resule => {
      return res.json({
        success: true,
        message: "trip deleted correctly"
      })
    })
    .catch(err => {
      return res.json({
        success: false,
        message: `try again`
      });
    })
}

module.exports.getAllTrips = (req, res, next) => {
  tripsModel.getAll()
    .then(result => {
      return res.json({
        success: true,
        data: result[0]
      })
    })
    .catch(err => {
      return res.json({
        success: false,
        message: err.message
      });
    })
}

module.exports.getTripById = (req, res, next) => {
  tripsModel.getById(req.params.id)
    .then(result => {
      return res.json({
        success: true,
        data: result[0]
      })
    })
    .catch(err => {
      return res.json({
        success: false,
        message: err.message
      });
    })
}


module.exports.updateTrip = (req, res, next) => {
  const trip = new tripsModel(req);
  trip.update(req.params.id)
    .then(resule => {
      return res.json({
        success: true,
        message: "trip updated correctly"
      })
    })
    .catch(err => {
      return res.json({
        success: false,
        message: "try again"
      });
    })
}


//helpers 
function addTripHelperFunction(tripGeneralInformation, TravelAgencyId) {
  return new Promise((resolve, reject) => {
    tripGeneralInformation['TravelAgencyId'] = TravelAgencyId;
    const trip = new tripsModel(tripGeneralInformation);
    trip.save()
      .then(result => {
        resolve({
          success: true,
          insertId: result[0].insertId
        })
      })
      .catch(err => {
        reject({
          success: false,
          err
        })
      })
  })
}