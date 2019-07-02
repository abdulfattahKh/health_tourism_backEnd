const procSpecClinicModel = require("../models/procSpecClinicModel");
const procedureModel = require("../models/procedureModel")

exports.addProcedure = (req, res, next) => {
    /// need at least (proc_id , spec_id ,clinic_id)
    obj = new procSpecClinicModel(req.body)
    obj.save()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                success: true,
                deleteClinicSpecialization: "adding process done successfully!!"
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err
            });
        });
};

exports.updateProcedure = (req, res, next) => {
    procSpecClinicModel.updateProcedure(req.params.procedureId, req.body)
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'updating procedure successfully.'
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'updating procedure failed!!',
                err: err
            });
        })

    /// need at least (proc_id , spec_id ,clinic_id)
    // obj = new procSpecClinicModel(req.body)
    // obj.save()
    //     .then(result => {
    //         return res.status(200).json({
    //             success: true,
    //             message: "updating process done successfully!!"
    //         })
    //     })
    //     .catch(err => {
    //         return res.status(500).json({
    //             success: false,
    //             message: err
    //         });
    //     });
};


exports.deleteProcedure = (req, res, next) => {
    /// need at least (proc_id , spec_id ,clinic_id)
    obj = new procSpecClinicModel(req.body)
    procSpecClinicModel.deleteProcedure(req.params.procedureId)
    .then(result => {
        return res.status(200).json({
            success: true,
            message: "deleting process done successfully!!"
        })
    })
    .catch(err => {
        return res.status(500).json({
            success: false,
            message: err
        });
    });

    // obj.delete()
    //     .then(result => {
    //         return res.status(200).json({
    //             success: true,
    //             message: "deleting process done successfully!!"
    //         })
    //     })
    //     .catch(err => {
    //         return res.status(500).json({
    //             success: false,
    //             message: err
    //         });
    //     });
};

/// view list of procedures according to some clinic ....
exports.getProcAccordToClinic = (req, res, next) => {
    if (!req.params["clinicId"]) {
        return res.status(400).json({
            success: false,
            message: "bad request"
        });
    }

    procSpecClinicModel
        .getClinicSpecializationsWithProcedures(req.params["clinicId"])
        .then(result => {
            console.log(result);
            res.status(200).json({
                ...result
            });
        })
        .catch(err => {
            res.status(500).json({
                ...err
            });
        });
};


/// get procedures according  to specialization_id 
exports.getProcAccordToSpec = (req, res, next) => {
    if (!req.params["specId"]) {
        return res.status(400).json({
            success: false,
            message: "bad request"
        });
    }

    procedureModel
        .viewAccordSpecId(req.params["specId"])
        .then(result => {
            if (!result.length) {
                return res.status(404).json({
                    success: false,
                    message: "request Not found"
                });
            }
            res.status(200).json({
                success: true,
                message: "the request was processed successfully.",
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: "Internal error"
            });
        });
};


/// get procedures according  to specialization_id 
exports.getProcAccordToAutoComplate = (req, res, next) => {
    if (!req.params["subWord"]) {
        return res.status(400).json({
            success: false,
            message: "bad request"
        });
    }

    procedureModel
        .viewAccordAutoComplate(req.params["subWord"])
        .then(result => {
            /// my have empty list (list of expanded name)
            res.status(200).json({
                success: true,
                message: "the request was processed successfully.",
                data: result
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: "Internal error"
            });
        });
};


exports.getClinicSpecializations = (req, res, next) => {
    if (!req.params['id']) {
        return res.status(400).json({
            success: false,
            message: 'bad requrest'
        })
    }
    procSpecClinicModel
        .getClinicSpecializations(req.params['id'])
        .then(result => {
            return res.status(200).json({
                ...result
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                ...err
            })
        })
}

exports.putSpecializationsPrimary = (req, res, next) => {
    if (!req.body['clinic_id'] || !req.body['specializations_clinics_id']) {
        return res.status(400).json({
            success: false,
            message: "bad requrest"
        })
    }
    procSpecClinicModel.putSpecializationsPrimary(req.body['value'], req.body['clinic_id'], req.body['specializations_clinics_id'])
        .then(result => {
            res.status(200).json({
                success: true,
                message: "it was set correctly"
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: "error",
                error: err
            })
        })

}

exports.getPopularProcedures = (req, res, next) => {
    procSpecClinicModel.getPopularProcedures()
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
                message: 'error'
            })
        })
}

exports.deleteClinicSpecialization = (req, res, next) => {
    if (!req.body.clinic_id || !req.body.spec_id) {
        return res.status(400).json({
            success: false,
            message: 'bad requrest'
        })
    }
    procSpecClinicModel.deleteClinicSpecialization(req.body.clinic_id, req.body.spec_id)
    .then(result=>{
        return res.status(200).json({
            success:true,
            message:"ok"
        })
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"OK",
        })
    })

}


exports.insertProceduresIntoDB = (req, res, next) => {
    procedureModel.insertProceduresIntoDB();
}