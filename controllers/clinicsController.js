const clinicModel = require("../models/clinicModel");

exports.getAllClinics = (req, res, next) => {
  clinicModel
    .getAllClinics()
    .then(result => {
      return res.status(200).json({
        success: true,
        data: result[0],
        message: "data was fetched correctly"
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: err
      });
    });
};

exports.getMyClinics = (req, res, next) => {
  if (!req.params["userId"]) {
    return res.status(400).json({
      success: false,
      message: "bad request"
    });
  }

  clinicModel
    .getMyClinics(req.params["userId"])
    .then(result => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "request Not found"
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
        message: "Internal error"
      });
    });
};

exports.getClinicTypes = (req, res, next) => {
  clinicModel
    .getClinicTypes()
    .then(result => {
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "request Not found"
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
        message: "Internal error"
      });
    });
};

exports.getClinicsByStatus = (req, res, next) => {
  if (!req.query["status"]) {
    return res.status(400).json({
      success: false,
      message: "bad requrest"
    });
  }
  clinicModel
    .getClinicsByStatus(req.query["status"])
    .then(result => {
      return res.json({
        success: true,
        message: "it was featchd correctly",
        data: result[0]
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: err
      });
    });
};

exports.getClinicsStatus = (req, res, next) => {
  clinicModel
    .getClinicsStatus()
    .then(result => {
      if (!result) {
        res.status(404).json({
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

exports.queryAddClinic = (req, res, next) => {
  const clinicObj = new clinicModel(req.body);
  clinicObj.save().then(result => {
    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Could not adding clinic, Please try again!!"
      });
    }
    res.status(200).json({
      success: true,
      message: "adding clinic successfully."
    });
  });
};
