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

router.get(
    "/addProcedure",
    check_auth,
    check_author([1,5]), /// admin & clinic owner ....
    procController.addProcedure
);

router.get(
    "/updateProcedure",
    check_auth,
    check_author([1,5]), /// admin & clinic owner ....
    procController.updateProcedure
);

router.get(
    "/deleteProcedure",
    check_auth,
    check_author([1,5]), /// admin & clinic owner ....
    procController.deleteProcedure
);


router.get(
    "/getProcAccordToClinic/:clinicId",
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


module.exports = router;

/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @end
 * 
 */