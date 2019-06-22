const locationModel = require("../models/locationModel");

// tested
exports.getAllCountries = (req, res, next) => {
  locationModel
    .getAllCountries()
    .then(result => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Data Not found"
        });
      }
      res.status(200).json({
        success: true,
        message: "the request was processed successfully.",
        data: result[0]
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: "Internal error server"
      });
    });
};

// tested
exports.getAllCitiesByCountryId = (req, res, next) => {
  const countryId = req.params.countryId;
  locationModel
    .getAllCitiesByCountryId(countryId)
    .then(result => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Data Not found"
        });
      }
      res.status(200).json({
        success: true,
        message: "the request was processed successfully.",
        data: result[0]
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: "Internal error server"
      });
    });
};

// tested
exports.getAllStatesByCityId = (req, res, next) => {
  const countryId = req.params.countryId;
  const cityId = req.params.cityId;
  locationModel
    .getAllStatesByCityId(countryId, cityId)
    .then(result => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Data Not found"
        });
      }
      res.status(200).json({
        success: true,
        message: "the request was processed successfully.",
        data: result[0]
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: "Internal error server"
      });
    });
};

module.exports.getCity = (req, res, next) => {
  if (!req.body['tableName'] || !req.body['id']) {
    return res.status(400).json({
      success: false,
      message: "bad requrest"
    })
  }
  locationModel.getCity(req.body['tableName'], req.body['id'])
    .then(result => {
      return res.status(200).json({
        success: true,
        message: 'ok',
        data: result[0]
      })
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: 'error',
        error: err
      })
    })
};


module.exports.getCountry = (req, res, next) => {
  if (!req.body['tableName'] || !req.body['id']) {
    return res.status(400).json({
      success: false,
      message: "bad requrest"
    })
  }
  locationModel.getCountry(req.body['tableName'], req.body['id'])
    .then(result => {
      return res.status(200).json({
        success: true,
        message: 'ok',
        data: result[0]
      })
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: 'error',
        error: err
      })
    })
};


module.exports.getState = (req, res, next) => {
  if (!req.body['tableName'] || !req.body['id']) {
    return res.status(400).json({
      success: false,
      message: "bad requrest"
    })
  }
  locationModel.getState(req.body['tableName'], req.body['id'])
    .then(result => {
      return res.status(200).json({
        success: true,
        message: 'ok',
        data: result[0]
      })
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: 'error',
        error: err
      })
    })
};