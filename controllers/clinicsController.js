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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/images/clinics')
    },
    filename: function (req, file, cb) {
        console.log(file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


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
    const clinicObj = new clinicModel(req.body);
    clinicObj.save(callAddMultipleTypes)
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


exports.postAddImages = async (req, res, next) => {
    const clinicId = req.body.clinicId;

    imagesModel.addImages({ clinicId: clinicId, array: req.files })
        .then(result => {
            console.log('Adding images successfully.');
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
            const path = image.image_path;
            const name = path.split('\\')[3];
            return imagesModel.deleteImageFromFolder(path, imageId);
        })
        .then(result => {
            console.log(result);
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
    descreptionModel.addDescreption('clinics', req.body.descreption, req.body.clinicId, -1)
        .then(result => {
            console.log(result);
            res.status(200).json({
                success: true,
                message: 'Adding descreption successfully.'
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

    const values = { currencies: req.body.currencies, clinicId: req.body.clinicId ? req.body.clinicId : null, travelAgencyId: req.body.travelAgencyId ? req.body.travelAgencyId : null };

    currencyModel.addCurrency(values)
        .then(result => {
            console.log(result);
            res.status(result.status).json({
                success: result.success,
                message: result.message
            })
        })
        .catch(err => {
            console.log(err);
            res.status(result.status).json({
                success: result.success,
                message: result.message
            })
        })

};


exports.deleteCurrency = (req, res, next) => {

    currencyModel.deleteCurrency(req.body.id)
        .then(result => {
            console.log(result);
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
    console.log(req.body.id, req.body.newCurrencyId);
    currencyModel.updateCurrency(req.body.id, req.body.newCurrencyId)
        .then(result => {
            console.log(result);
            res.status(200).json({
                success: true,
                message: 'Updating currency successfully.'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Updaing currency failed!'
            })
        })
};


deleteClinicById = clinicId => {
    return new Promise(async (resolve, reject) => {
        try {
            let deleteRes = await clinicModel.deleteClinciById(clinicId);
            if (deleteRes[0].affectedRows > 0) {
                resolve({ success: true, message: 'Deleting clinic successfully.', status: 200 });
            } else {
                resolve({ success: false, message: 'Deleting clinic failed!' });
            }
        } catch (err) {
            console.log(err);
            reject({ success: false, message: 'Internal server error!', status: 500 });
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
                        console.log({ success: false, message: err });
                        reject(err);
                    } else {
                        resolve({ success: true, message: "inserting was done correctly" });
                    }
                }
            );
        });
    }));
}



// const clinicModel = require('../models/clinicModel');
// const Promise = require('bluebird');
// const connection = require("../utilites/db2");
// const imagesModel = require('../models/images');
// const descreptionModel = require('../models/descreption');
// const multer = require('multer');
// const db = require('../utilites/db');
// const fs = require('fs');
// // const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'upload/images/clinics')
//     },
//     filename: function (req, file, cb) {
//         console.log(file.originalname);
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload = multer({ storage: storage });


// // get requests

// exports.getAllClinics = (req, res, next) => {
//     clinicModel
//         .getAllClinics()
//         .then(result => {
//             return res.status(200).json({
//                 success: true,
//                 data: result[0],
//                 message: "data was fetched correctly"
//             });
//         })
//         .catch(err => {
//             return res.status(500).json({
//                 success: false,
//                 message: err
//             });
//         });
// };

// exports.getMyClinics = (req, res, next) => {
//     if (!req.params["userId"]) {
//         return res.status(400).json({
//             success: false,
//             message: "bad request"
//         });
//     }

//     clinicModel
//         .getMyClinics(req.params["userId"])
//         .then(result => {
//             if (!result) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "request Not found"
//                 });
//             }
//             res.status(200).json({
//                 success: true,
//                 message: "the request was processed successfully.",
//                 data: result[0]
//             });
//         })
//         .catch(err => {
//             res.status(500).json({
//                 success: false,
//                 message: "Internal error"
//             });
//         });
// };


// exports.getClinicsStatus = (req, res, next) => {

//     clinicModel.getClinicsStatus()
//         .then(result => {
//             if (!result) {
//                 res.status(404).json({
//                     success: false,
//                     message: 'Data Not found'
//                 });
//             }
//             res.status(200).json({
//                 success: true,
//                 message: 'the request was processed successfully.',
//                 data: result[0]
//             });
//         })
//         .catch(err => {
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal error server'
//             });
//         })
// }
// exports.getClinicTypes = (req, res, next) => {
//     clinicModel
//         .getClinicTypes()
//         .then(result => {
//             res.status(200).json({
//                 success: true,
//                 message: "the request was processed successfully.",
//                 data: result[0]
//             });
//         })
//         .catch(err => {
//             res.status(500).json({
//                 success: false,
//                 message: err
//             });
//         });
// };

// exports.getClinicsByStatus = (req, res, next) => {
//     if (!req.query["status"]) {
//         return res.status(400).json({
//             success: false,
//             message: "bad requrest"
//         });
//     }
//     clinicModel
//         .getClinicsByStatus(req.query["status"])
//         .then(result => {
//             return res.json({
//                 success: true,
//                 message: "it was featchd correctly",
//                 data: result[0]
//             });
//         })
//         .catch(err => {
//             return res.status(500).json({
//                 success: false,
//                 message: err
//             });
//         });
// };


// // post requests 

// exports.postAddClinic = (req, res, next) => {
//     const clinicObj = new clinicModel(req.body);
//     clinicObj.save(callAddMultipleTypes)
//         .then(result => {
//             console.log(req.files);
//             if (!result) {
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Could not adding clinic, Please try again!!'
//                 });
//             }
//             res.status(200).json({
//                 success: true,
//                 message: 'adding clinic successfully.'
//             });
//         })
//         .catch(err => {
//             res.json({
//                 success: false,
//                 message: 'Could not adding clinic, Please try again!!'
//             })
//         })
// };


// exports.postAddImages = async (req, res, next) => {
//     const clinicId = req.body.clinicId;

//     imagesModel.addImages({ clinicId: clinicId, array: req.files })
//         .then(result => {
//             console.log('Adding images successfully.');
//         })
//         .catch(err => {
//             new Promise((resolve, reject) => {
//                 req.files.forEach(el => {
//                     const path = el.path;
//                     fs.unlink(path, (err) => {
//                         if (err) {
//                             reject();
//                         } else {
//                             resolve();
//                         }
//                     })
//                 })
//             })
//                 .then(result => {
//                     console.log('Deleting files successfully.');
//                     res.status(500).json({
//                         success: false,
//                         message: 'Internal server error!'
//                     });
//                 })
//                 .catch(err => {
//                     res.status(500).json({
//                         success: false,
//                         message: 'Internal server error!'
//                     });
//                 })
//         })


// };



// // delete requests

// exports.deleteClinicById = (req, res, next) => {
//     const clinicId = req.params.clinicId;
//     deleteClinicById(clinicId)
//         .then(result => {
//             return res.status(result.status).json({
//                 success: result.success,
//                 message: result.message
//             });
//         })
//         .catch(err => {
//             return res.status(result.status).json({
//                 success: result.success,
//                 message: result.message
//             });
//         })
// }

// exports.deleteImageById = (req, res, next) => {
//     let imageId = req.params.imageId;
//     let image;
//     imagesModel.getImageById(imageId)
//         .then(result => {
//             if (!result[0][0] || !result[0][0].image_id) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'image Not found!'
//                 });
//             }
//             image = result[0][0];
//             return imagesModel.deleteImageFromDataBase(imageId);
//         })
//         .then(result => {
//             const path = image.image_path;
//             const name = path.split('\\')[3];
//             return imagesModel.deleteImageFromFolder(path, imageId);
//         })
//         .then(result => {
//             console.log(result);
//             console.log('Deleting images successfully.');
//             res.status(result.status).json({
//                 success: result.success,
//                 message: result.message
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error!'
//             })

//         })
// };


// // put requests

// exports.putAddDescreption = (req, res, next) => {
//     descreptionModel.addDescreption('clinics', req.body.descreption, req.body.clinicId, -1)
//         .then(result => {
//             console.log(result);
//             res.status(200).json({
//                 success: true,
//                 message: 'Adding descreption successfully.'
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error!'
//             })
//         })

// };

// exports.putChangeClinicStatus = (req, res, next) => {
//     const clinicId = req.params.clinicId;
//     const status = req.query.status;
//     if (status === 'accepted') {
//         clinicModel.changeClinicStatus(clinicId, status)
//             .then(result => {
//                 if (!result) {
//                     return res.status(404).json({
//                         success: false,
//                         message: 'Clinic Not found!'
//                     });
//                 }
//                 return res.status(200).json({
//                     success: true,
//                     message: 'Changing status successfully.'
//                 });
//             })
//             .catch(err => {
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Internal error server!'
//                 });
//             })
//     } else if (status === 'rejected') {
//         deleteClinicById(clinicId)
//             .then(result => {
//                 return res.status(result.status).json({
//                     success: result.success,
//                     message: result.message
//                 });
//             })
//             .catch(err => {
//                 return res.status(result.status).json({
//                     success: result.success,
//                     message: result.message
//                 })
//             })
//         // clinicModel.deleteClinciById(clinicId)
//         //     .then(result => {
//         //         if (!result) {
//         //             return res.status(404).json({
//         //                 success: false,
//         //                 message: 'Clinic Not found!'
//         //             });
//         //         }
//         //         return res.status(200).json({
//         //             success: true,
//         //             message: 'Clinic was deleted.'
//         //         })
//         //     })
//         //     .catch(err => {
//         //         return res.status(500).json({
//         //             success: false,
//         //             message: 'Internal error server!'
//         //         })
//         //     })
//     }
// };



// deleteClinicById = clinicId => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let deleteRes = await clinicModel.deleteClinciById(clinicId);
//             if (deleteRes[0].affectedRows > 0) {
//                 resolve({ success: true, message: 'Deleting clinic successfully.', status: 200 });
//             } else {
//                 resolve({ success: false, message: 'Deleting clinic failed!' });
//             }
//         } catch (err) {
//             console.log(err);
//             reject({ success: false, message: 'Internal server error!', status: 500 });
//         }
//     });
// };


// function callAddMultipleTypes(clinicId = -1, types = []) {
//     Promise.all(addMultipleTypes(clinicId, types));
// }


// function addMultipleTypes(clinicId, types = []) {
//     return (PromiseArray = types.map(value => {
//         console.log('Omar:    ' + value);
//         return new Promise((resolve, reject) => {
//             connection.query(
//                 `insert into specializations_clinics (specialization_id, clinic_id) values (?, ?)`,
//                 [value, clinicId],
//                 (err, RES) => {
//                     if (err) {
//                         console.log({ success: false, message: err });
//                         reject(err);
//                     } else {
//                         resolve({ success: true, message: "inserting was done correctly" });
//                     }
//                 }
//             );
//         });
//     }));
// }

