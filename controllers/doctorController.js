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
            res.status(result.status).json({
                success: result.success,
                message: result.message,
                err: result.err
            })
        })
};

exports.getAllDoctorsByClinicId = (req, res, next) => {

    const clinicId = req.params.clinicId;

    doctorModel.getAllDoctorsByClinicId(clinicId)
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Getting all doctors of one clinic successfully.',
                data: result[0]
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

    doctorModel.getDoctorById(req.params.doctorId)
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Getting doctor successfully.',
                data: result[0]
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


exports.postAddImgae = (req, res, next) => {

    const file = upload.single('image');

    file(req, res, err => {
        if (err) {
            return res.json({
                success: false,
                message: 'Uploading image failed!',
                err: err
            })
        }
        doctorModel.addImage(req.file.path, req.params.doctorId)
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