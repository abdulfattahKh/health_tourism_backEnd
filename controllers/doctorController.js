const doctorModel = require('../models/doctorModel');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/images/doctors')
    },
    filename: function (req, file, cb) {
        console.log(file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage
});



exports.addDoctor = (req, res, next) => {

    const doctor = new doctorModel(req.body);

    const clinicId = req.params.clinicId;

    console.log(doctor);

    doctor.save(clinicId)
        .then(result => {
            res.status(200).json({
                success: result.success,
                message: result.message,
                doctorId: result.doctorId
            })
        })
        .catch(err => {
            res.status(err.status).json({
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
            return res.status(500).json({
                success: false,
                message: 'Updating doctor failed!',
                err: err
            })
        })
};


exports.postAddExperincesToDoctor = (req, res, next) => {

    const experinces = req.body.experinces;
    const doctorId = req.params.doctorId;

    doctorModel.addExperiencesToDoctor(experinces, doctorId)
        .then(result => {
            res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data
            })
        })
        .catch(result => {
            console.log(result);
            res.status(result.status).json({
                success: result.success,
                message: result.message,
                err: result.err
            })
        })
};

exports.getAllDoctorsByClinicId = (req, res, next) => {

    const clinicId = req.params.clinicId;

    let data = [];

    doctorModel.getAllDoctorsByClinicId(clinicId)
        .then(result => {
            // console.log(result);
            return new Promise((resolve, reject) => {
                if (result[0].length === 0) {
                    resolve();
                } else {
                    result[0].forEach(doctor => {
                        doctorModel.getAllExperincesByDoctorId(doctor.id)
                            .then(rs => {
                                data.push({ id: doctor.id, firstName: doctor.first_name, lastName: doctor.last_name, gender: doctor.gender, imageName: doctor.image_name, phoneNumber: doctor.phone_number, mobileNumber: doctor.mobile_number, experinces: rs[0] });
                                if (data.length === result[0].length) {
                                    resolve();
                                }
                            })
                            .catch(err => {
                                reject({ err: err });
                            })
                    })
                }
            });
        })
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Getting all doctors of a clinic successfully.',
                data: data
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Getting all doctors of one clinic failes!',
                err: err
            })
        })


};



exports.getDoctorById = (req, res, next) => {

    let data = [];

    let doctor;

    doctorModel.getDoctorById(req.params.doctorId)
        .then(result => {
            doctor = result[0][0];
            return doctorModel.getAllExperincesByDoctorId(result[0][0].id);
        })
        .then(result => {
            data.push({ id: doctor.id, firstName: doctor.first_name, lastName: doctor.last_name, gender: doctor.gender, imageName: doctor.image_name, mobileNumber: doctor.mobile_number, phoneNumber: doctor.phone_number, experinces: result[0] });
            res.status(200).json({
                success: true,
                message: 'Getting doctor successfully.',
                data: data
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Getting doctor failed!',
                err: err
            })
        })

};


exports.postAddImage = (req, res, next) => {

    const file = upload.single('image');

    file(req, res, err => {
        if (err) {
            return res.json({
                success: false,
                message: 'Uploading image failed!',
                err: err
            })
        }
        doctorModel.addImage(req.file.filename, req.params.doctorId)
            .then(result => {
                res.status(200).json({
                    success: true,
                    message: 'Adding image successfully.',
                })
            })
            .catch(err => {
                console.log(err);
                fs.unlink(imagePath, err => {
                    res.status(500).json({
                        success: false,
                        message: 'Adding image failed!'
                    })

                })

            })
    })


};


exports.deleteImage = (req, res, next) => {

    doctorModel.deleteImage(req.params.doctorId)
        .then(result => {
            res.status(result.status).json({
                success: result.success,
                message: result.message
            })
        })
        .catch(result => {
            console.log(result);
            res.status(result.status).json({
                success: result.success,
                message: result.message,
                err: result.err
            })
        })

};