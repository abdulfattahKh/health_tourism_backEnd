/****
 * 
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

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, "upload/images/clinics");
//   },
//   filename: function(req, file, cb) {
//     console.log(file.originalname);
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });
// const upload = multer({ storage: storage });

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

module.exports = router;

/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @end
 * 
 */