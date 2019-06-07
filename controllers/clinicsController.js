const clinicModel = require('../models/clinicModel');

exports.getAllClinics = (req, res, next) => {
    clinicModel.getAllClinics()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Date not found'
                })
            }
            res.status(200).json({
                success: true,
                message: 'the request was proccessed successfully.',
                data: result[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Internal server error!'
            })
        })
};


exports.getClinicTypes = (req, res, next) => {
    clinicModel.getClinicTypes()
        .then(result => {
            if (!result) {
                return res.status(404).json({
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


exports.getAllClinicsOfAnUser = (req, res, next) => {
    clinicModel.getAllClinicsOfAnUser(req.params.userId)
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Data not found!'
                });
            }
            console.log(result);
            res.status(200).json({
                success: true,
                message: 'the request was proccessed successfully.',
                data: result[0]
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Internal server error!'
            });
        });
};

exports.addClinic = (req, res, next) => {
    const clinicObj = new clinicModel(req);
    clinicObj.save()
        .then(result => {
            console.log(req.files);
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
        .catch(err => {
            res.json({
                success: false,
                message: 'Could not adding clinic, Please try again!!'
            })
        })
};


exports.putChangeClinicStatus = (req, res, next) => {
    const clinicId = req.params.clinicId;
    const status = req.query.status;
    if (status === 'accepted') {
        clinicModel.changeClinicStatus(clinicId, status)
            .then(result => {
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Clinic Not found!'
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Changing status successfully.'
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: 'Internal error server!'
                });
            })
    } else if (status === 'rejected') {
        clinicModel.deleteClinciById(clinicId)
            .then(result => {
                if (!result) {
                    return res.status(404).json({
                        success: false,
                        message: 'Clinic Not found!'
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Clinic was deleted.'
                })
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: 'Internal error server!'
                })
            })
    }
};
