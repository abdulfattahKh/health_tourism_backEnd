/****
 * 
 * @author Abdulrahman Al hussein 
 * @start
 * 
 */
const express = require("express");
const multer = require("multer");
const router = express.Router();
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middlewares/check_authorization");

const procController = require("../controllers/procedureController");

router.post(
    "/addProcedure",
    // check_auth,
    // check_author([1,5]), /// admin & clinic owner ....
    procController.addProcedure
);

router.post(
    "/updateProcedure/:procedureId",
    // check_auth,
    // check_author([1,5]), /// admin & clinic owner ....
    procController.updateProcedure
);

router.post(
    "/deleteProcedure/:procedureId",
    // check_auth,
    // check_author([1,5]), /// admin & clinic owner ....
    procController.deleteProcedure
);

router.get(
    "/getProcAccordClinic/:clinicId",
    check_auth,
    check_author([1,5]), /// admin & clinic owner   ....
    procController.getProcAccordToClinic
);

router.get(
    "/getProcAccordToSpec/:specId",
    check_auth,
    check_author([1,5]), /// admin & clinic owner   ....
    procController.getProcAccordToSpec
);

router.get(
    "/getProcAccordToAutoComplate/:subWord",
    check_auth,
    check_author([1,5]), /// admin & clinic owner   ....
    procController.getProcAccordToAutoComplate
);

router.get('/insertProceduresIntoDB',procController.insertProceduresIntoDB);

router.get("/getClinicSpecializations/:id",procController.getClinicSpecializations);

router.post('/putSpecializationsPrimary/',procController.putSpecializationsPrimary);

router.get('/deleteClinicSpecialization/',procController.deleteClinicSpecialization);
module.exports = router;

/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @end
 * 
 */