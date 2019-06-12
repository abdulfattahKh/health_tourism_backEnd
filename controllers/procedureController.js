/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @start
 * 
 */
const procSpecClinicModel = require("../models/procSpecClinicModel");
const procedureModel = require("../models/procedureModel")

exports.addProcedure = (req, res, next) => {
    /// need at least (proc_id , spec_id ,clinic_id)
    obj = new procSpecClinicModel(req.body)
    obj.save()
        .then(result=>{
            return res.status(200).json({
                success: true,
                message: "adding process done successfully!!"
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
    /// need at least (proc_id , spec_id ,clinic_id)
    obj = new procSpecClinicModel(req.body)
    obj.save()
        .then(result=>{
            return res.status(200).json({
                success: true,
                message: "updating process done successfully!!"
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err
            });
        });
};


exports.deleteProcedure = (req, res, next) => {
    /// need at least (proc_id , spec_id ,clinic_id)
    obj = new procSpecClinicModel(req.body)
    obj.delete()
        .then(result=>{
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
    .viewAccordClinic(req.params["clinicId"])
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



/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @end
 * 
 */