const clinicModel = require('../models/clinicModel');

exports.getClinicTypes = (req, res, next) => {
    clinicModel.getClinicTypes()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'request Not found'
                });
            }
            res.status(200).json({
                success: true,
                message: result[0]
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Internal error'
            });
        });
};


exports.postAddClinic = (req, res, next) => {
    const clinic = new clinicModel();
    clinic.save()
        .then(result => {

        })
        .catch(err => {

        });
};