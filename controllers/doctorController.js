const doctorModel = require('../models/doctorModel');


exports.addDoctor = (req, res, next) => {

    const doctor = new doctorModel(req.body);

    const clinicId = req.params.clinicId;

    console.log(doctor);

    doctor.save(clinicId)
        .then(result => {
            res.status(200).json({
                success: result.success,
                message: result.message
            })
        })
        .catch(err => {
            res.status(500).json({
                success: err.success,
                message: err.message,
                err: err.err
            })
        })
};


exports.deleteDoctor = (req, res, next) => {

    const doctorId = req.params.doctorId;
    doctorModel.deleteDoctor(doctorId)
        .then(result => {
            console.log(result);
            if (result[0].affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Deleting doctor successfully.'
                })
            }
            res.status(404).json({
                success: false,
                message: 'Doctor Not found!'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Deleting doctor failed!',
                err: err
            })
        })

};



exports.updateDoctor = (req, res, next) => {

    console.log('Omar');
    const doctorId = req.params.doctorId;

    doctorModel.updateDoctor(doctorId, req.body)
        .then(result => {
            console.log(result[0]);
            if (result[0].affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Updaing doctor successfully.'
                })
            }
            res.status(404).json({
                success: false,
                message: 'Doctor Not found!'
           })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Updating doctor failed!',
                err: err
            })
        })
};