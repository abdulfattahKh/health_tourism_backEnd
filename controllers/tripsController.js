const connection = require('../utilites/db')
const tripsModel = require('../models/tripsModel')


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

module.exports.getAllTrips = (req,res,next) => {
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

module.exports.getTripById = (req,res,next) => {
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
