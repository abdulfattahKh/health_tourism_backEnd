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
                message: 'the request was processed successfully.',
                data: result[0]
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Internal error'
            });
        });
};


exports.getClinicsStatus = (req, res, next) => {

    clinicModel.getClinicsStatus()
        .then(result => {
            if (!result) {
                res.status(404).json({
                    success: false,
                    message: 'Data Not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'the request was processed successfully.',
                data: result[0]
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Internal error server'
            });
        })

};



exports.queryAddClinic = (req, res, next) => {
    const clinicObj = new clinicModel(req.body);
    clinicObj.save()
        .then(result => {
            if (!result) {
                return res.status(500).json({
                    success: false,
                    message: 'Could not adding clinic, Please try again!!'
                });
    
            }
            res.status(200).json({
                success: true,
                message: 'adding clinic successfully.'
            });
        })
};