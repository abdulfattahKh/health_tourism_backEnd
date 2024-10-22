const io = require('../utilites/socket');
const clinicModel = require('../models/clinicModel');
const currencyModel = require('../models/currencyModel');
const Promise = require('bluebird');
const connection = require("../utilites/db2");
const imagesModel = require('../models/images');
const descreptionModel = require('../models/descreption');
const multer = require('multer');
const db = require('../utilites/db');
const fs = require('fs');
// const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'upload/images/clinics')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload = multer({
//     storage: storage
// });


// get requests

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
            console.log(err);
            return res.status(500).json({
                success: false,
                message: err
            });
        });
};

exports.getClinicTypesById = (req, res, next) => {
    if (!req.params['id']) {
        res.json({
            success: false,
            message: 'error with params'
        })
    }
    clinicModel.getClinicTypesById(req.params['id'])
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'success',
                data: result[0]
            })
        })
}

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
}

exports.getClinicById = (req, res, next) => {
    if (!req.params['id']) {
        return res.status(400)
            .json({
                success: false,
                message: 'there was a problem with your params'
            })
    }
    clinicModel
        .getClinicById(req.params['id'])
        .then(result => {
            return res.status(200).json({
                success: true,
                message: 'success',
                data: result[0]
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: err
            })
        })
}
exports.getClinicTypes = (req, res, next) => {
    clinicModel
        .getClinicTypes()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "the request was processed successfully.",
                data: result[0]
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err
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


// post requests 

exports.postAddClinic = (req, res, next) => {
    let clinicId;
    let data = [];
    const clinicObj = new clinicModel(req.body);
    clinicObj.save()
        .then(result => {
            clinicId = result.id;
            return clinicModel.getClinicById(clinicId);
        })
        .then(result => {
            data = result[0][0];
            return clinicModel.getClinicTypesById(clinicId);
        })
        .then(result => {
            data.types = result[0];
            res.status(200).json({
                success: true,
                message: 'Adding clinic successfully.',
                id: data.id
            })
            // adding socket.io 
            io.getIO().emit('queryAddClinic', {
                action: 'addingClinic',
                data: data
            });
        })
        .catch(result => {
            console.log(result.err);
            res.status(500).json({
                success: result.success,
                message: result.message,
                err: result.err
            });
        })
};


exports.postAddImages = (req, res, next) => {
    const clinicId = req.params.clinicId;
    imagesModel.addImages({
            clinicId: clinicId,
            array: req.files
        })
        .then(result => {
            return res.status(200).json({
                success: result.success,
                message: result.message,
                data: result.data
            })
        })
        .catch(err => {
            new Promise((resolve, reject) => {
                    req.files.forEach(el => {
                        const path = el.path;
                        fs.unlink(path, (err) => {
                            if (err) {
                                reject();
                            } else {
                                resolve();
                            }
                        })
                    })
                })
                .then(result => {
                    console.log('Deleting files successfully.');
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error!'
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error!'
                    });
                })
        })


};



// delete requests

exports.deleteClinicById = (req, res, next) => {
    const clinicId = req.params.clinicId;
    deleteClinicById(clinicId)
        .then(result => {
            return res.status(result.status).json({
                success: result.success,
                message: result.message
            });
        })
        .catch(err => {
            return res.status(result.status).json({
                success: result.success,
                message: result.message
            });
        })
}

exports.deleteImageById = (req, res, next) => {
    let imageId = req.params.imageId;
    let image;
    imagesModel.getImageById(imageId)
        .then(result => {
            if (!result[0][0] || !result[0][0].image_id) {
                return res.status(404).json({
                    success: false,
                    message: 'image Not found!'
                });
            }
            image = result[0][0];
            return imagesModel.deleteImageFromDataBase(imageId);
        })
        .then(result => {
            const path = 'upload/images/clinics/' + image.image_name;
            return imagesModel.deleteImageFromFolder(path, imageId);
        })
        .then(result => {
            console.log('Deleting images successfully.');
            res.status(result.status).json({
                success: result.success,
                message: result.message
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Internal server error!'
            })

        })
};


// put requests

exports.putAddDescreption = (req, res, next) => {

    console.log(req.body);

    descreptionModel.addDescreption('clinics', req.body.description, req.params.clinicId, -1)
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Adding description successfully.'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Internal server error!'
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
                io.getIO().emit('adding clinic accepted', {
                    message: 'Congratulations, your request for adding clinic in our site accepted.'
                })
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
        deleteClinicById(clinicId)
            .then(result => {
                return res.status(result.status).json({
                    success: result.success,
                    message: result.message
                });
            })
            .catch(err => {
                return res.status(result.status).json({
                    success: result.success,
                    message: result.message
                })
            })
        // clinicModel.deleteClinciById(clinicId)
        //     .then(result => {
        //         if (!result) {
        //             return res.status(404).json({
        //                 success: false,
        //                 message: 'Clinic Not found!'
        //             });
        //         }
        //         return res.status(200).json({
        //             success: true,
        //             message: 'Clinic was deleted.'
        //         })
        //     })
        //     .catch(err => {
        //         return res.status(500).json({
        //             success: false,
        //             message: 'Internal error server!'
        //         })
        //     })
    }
};


exports.postAddCurrency = (req, res, next) => {
    const values = {
        currencies: req.body.currencies,
        clinicId: req.params.clinicId
    };
    currencyModel.addCurrency(values)
        .then(result => {
            res.status(result.status).json({
                success: result.success,
                message: result.message,
                data: result.data
            })
        })
        .catch(err => {
            console.log(err);
            res.status(err.status).json({
                success: err.success,
                message: err.message
            })
        })

};


exports.deleteCurrency = (req, res, next) => {

    currencyModel.deleteCurrency(req.params.currencyId)
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Deleting currency successfully.'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Deleting currency failed!'
            })
        })

};

exports.updateCurrency = (req, res, next) => {
    currencyModel.updateCurrency({
            clinicId: req.params.clinicId,
            currencies: req.body.currencies
        })
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Updating currencies in clinic successfully.'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Updaing currency failed!',
                err: err.err
            })
        })
};

exports.getClinicCountry = (req, res, next) => {

    clinicModel.getClinicCountry(req.params.clinicId)
        .then(result => {

            res.status(200).json({
                success: true,
                message: 'Getting country successfully.',
                data: result[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Getting country failed!',
                err: err
            })
        })

};


exports.getClinicCity = (req, res, next) => {

    clinicModel.getClinicCity(req.params.clinicId)
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Getting city successfully.',
                data: result[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Getting city failed!',
                err: err
            })
        })
}


exports.getClinicState = (req, res, next) => {

    clinicModel.getClinicState(req.params.clinicId)
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Getting state succesffully.',
                data: result[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Getting state failed!',
                err: err
            })
        })
};


exports.getDescreption = (req, res, next) => {

    descreptionModel.getDescreption('clinics', req.params.clinicId)
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Getting descreption successfully.',
                data: result[0][0]
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Getting descreption failed!',
                err: err
            })
        })

};

exports.getAllCurrencies = (req, res, next) => {

    currencyModel.getAllCurrencies()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'http Not found!'
                })
            }
            res.status(200).json({
                success: true,
                message: 'Getting all currencies.',
                data: result[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Internal server error!',
                err: err
            })
        })

};


exports.getAllCurrenciesById = (req, res, next) => {

    const clinicId = req.params.clinicId ? req.params.clinicId : null;
    const travelAgencyId = req.params.travelAgencyId ? req.params.travelAgencyId : null;


    currencyModel.getAllCurrenciesById(clinicId, travelAgencyId)
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Getting All currencies for one clinic.',
                data: result[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Getting currencies failed!',
                err: err
            })
        })

};


exports.getAllImagesByClinicId = (req, res, next) => {
    const data = [];
    imagesModel.getAllImgaesByClinicId(req.params.clinicId)
        .then(result => {
            result[0].forEach(image => {
                data.push({
                    id: image.image_id,
                    name: image.image_name
                });
            })
            res.status(200).json({
                success: true,
                message: 'Getting all images for an clinic.',
                data: data
            })
        })
        .catch(err => {

            res.status(500).json({
                success: false,
                message: 'Internal server error!',
                err: err
            })
        })

};


exports.putUpdateClinic = (req, res, next) => {

    console.log(req.body);


    clinicModel.putUpdateClinic(req.params.clinicId, req.body)
        .then(result => {
            console.log('Updaited');
            res.status(result.status).json({
                success: result.success,
                message: result.message
            })
        })
        .catch(result => {
            console.log(result);
            console.log('Error');
            res.status(result.status).json({
                success: result.success,
                message: result.message,
                err: result.err
            })
        })

};

exports.addRequestOfTreatment = (req, res, next) => {

    if (!req.body.general) {
        req.body.general = 0;
    }


    if (!req.body.dateTravel) {
        req.body.dateTravel = 0;
    }


    req.body.userId = req.params.userId;
    req.body.procedures = req.body.clinicTypes;

    let data;

    clinicModel.addRequestOfTreatment(req.body)
        .then(result => {
            console.log('1')
            console.log(result);
            data = result;
            return imagesModel.addImages({
                applicationId: data.id,
                array: req.body.images
            });
        })
        .then(result => {
            console.log(result);
            data.images = result.data;
            res.status(200).json({
                success: true,
                message: 'sending application successfully.',
                data: data
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'sending appliation failed!!',
                err: err
            })
        })
};




exports.getAllRequestOfClinic = (req, res, next) => {

    let data;
    console.log(req.body);
    if (!req.body.general) {

        clinicModel.getAllRequestTreatmentOfClinic(req.body.clinicId)
            .then(result => {
                data = result[0];
                return new Promise((resolve, reject) => {
                    for (let i = 0; i < data.length; i++) {
                        clinicModel.getAllProcedures(data[i].id)
                            .then(result => {
                                data[i].procedures = result[0];
                                if (i === data.length - 1) {
                                    resolve();
                                }
                            })
                            .catch(err => {
                                reject({
                                    err: err
                                });
                            })
                    }
                });
            })
            .then(result => {
                console.log('ssss');
                res.status(200).json({
                    success: true,
                    message: 'Getting all requestTreatment successfully.',
                    data: data
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    message: 'Getting all requestTreatment failed!!',
                    err: err
                })
            })
    } else {
        clinicModel.getAllRequestTreatmentOfAdmin(req.params.general)
            .then(result => {
                data = result[0];
                return new Promise((resolve, reject) => {
                    for (let i = 0; i < data.length; i++) {
                        clinicModel.getAllProcedures(data[i].id)
                            .then(result => {
                                data[i].procedures = result[0];
                                if (i === data.length - 1) {
                                    resolve();
                                }
                            })
                            .catch(err => {
                                reject({
                                    err: err
                                });
                            })
                    }
                });
            })
            .then(result => {
                console.log('ssss');
                res.status(200).json({
                    success: true,
                    message: 'Getting all requestTreatment successfully.',
                    data: data
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    message: 'Getting all requestTreatment failed!!',
                    err: err
                })
            })

    }

}

exports.deleteApplication = (req, res, next) => {

    clinicModel.deleteApplication(req.params.applicationId)
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Deleting application successfully.'
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Deleting application failed!!',
                err: err
            })
        })

};


exports.search = (req, res, next) => {
    const procedure = req.body['procedure'];
    const country = req.body['country'];
    const city = req.body['city'];
    const state = req.body['state'];
    clinicModel.search(procedure, country, city, state)
        .then(result => {
            return res.status(200).json({
                success: true,
                message: 'success',
                data: result[0]
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err
            })
        })

}


exports.getAllRequest = (req, res, next) => {

    let data;

    if (req.body.general) {

        clinicModel.getAllRequestTreatmentOfClinic(req.params.clinicId)
            .then(result => {
                data = result[0];
                return new Promise((resolve, reject) => {
                    for (let i = 0; i < data.length; i++) {
                        clinicModel.getAllProcedures(data[i].id)
                            .then(result => {
                                data[i].procedures = result[0];
                                if (i === data.length - 1) {
                                    resolve();
                                }
                            })
                            .catch(err => {
                                reject({
                                    err: err
                                });
                            })
                    }
                });
            })
            .then(result => {
                console.log('ssss');
                res.status(200).json({
                    success: true,
                    message: 'Getting all requestTreatment successfully.',
                    data: data
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    message: 'Getting all requestTreatment failed!!',
                    err: err
                })
            })
    } else {
        clinicModel.getAllRequestTreatmentOfAdmin()
            .then(result => {
                data = result[0];
                return new Promise((resolve, reject) => {
                    for (let i = 0; i < data.length; i++) {
                        clinicModel.getAllProcedures(data[i].id)
                            .then(result => {
                                data[i].procedures = result[0];
                                if (i === data.length - 1) {
                                    resolve();
                                }
                            })
                            .catch(err => {
                                reject({
                                    err: err
                                });
                            })
                    }
                });
            })
            .then(result => {
                console.log('ssss');
                res.status(200).json({
                    success: true,
                    message: 'Getting all requestTreatment successfully.',
                    data: data
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    message: 'Getting all requestTreatment failed!!',
                    err: err
                })
            })

    }

}


deleteClinicById = clinicId => {
    return new Promise(async (resolve, reject) => {
        try {
            let deleteRes = await clinicModel.deleteClinciById(clinicId);
            if (deleteRes[0].affectedRows > 0) {
                resolve({
                    success: true,
                    message: 'Deleting clinic successfully.',
                    status: 200
                });
            } else {
                resolve({
                    success: false,
                    message: 'Deleting clinic failed!'
                });
            }
        } catch (err) {
            console.log(err);
            reject({
                success: false,
                message: 'Internal server error!',
                status: 500
            });
        }
    });
};


function callAddMultipleTypes(clinicId = -1, types = []) {
    Promise.all(addMultipleTypes(clinicId, types));
}


function addMultipleTypes(clinicId, types = []) {
    return (PromiseArray = types.map(value => {
        console.log('Omar:    ' + value);
        return new Promise((resolve, reject) => {
            connection.query(
                `insert into specializations_clinics (specialization_id, clinic_id) values (?, ?)`,
                [value, clinicId],
                (err, RES) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            success: true,
                            message: "inserting was done correctly"
                        });
                    }
                }
            );
        });
    }));
}