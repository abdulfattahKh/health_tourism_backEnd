const express = require("express");
const check_auth = require("../middleWares/check_authentication");
const check_author = require("../middleWares/check_authorization");
const roleController = require("../controllers/RolesController");
const travelAgencyController = require("../controllers/travelAgencyController");
const router = express.Router();

/// work yes
router.post("/:userId", travelAgencyController.addTravel);

// //work yes
// router.put("/:id", travelAgencyController.updateTravel);

// ///work yes
// router.delete("/:id", travelAgencyController.deleteTravel);

// ///work yes
// router.put("/changeStatus/:id", travelAgencyController.changeStatus);



//OK
router.get("/allTravelAgencies", travelAgencyController.getAllTravel);

//OK
router.get("/TravelAgenciesByStatus/", travelAgencyController.getAllTravelByStatus);

router.get("/myTravelAgencies/:userId",travelAgencyController.getMyTravelAgencies);
///
router.post("/addImage/:travelAgencyId", travelAgencyController.postAddImage);

///
router.delete('/deleteImage/:imageId', travelAgencyController.deleteImage);
//work yes
router.get("/:id", travelAgencyController.getAllTravelById);

router.get("/getAllImgaesByTravelAgencyId/:travelId", (req, res, next) => {
    travelAgencyController.getAllImgaesByTravelAgencyId(req.params.travelId)
        .then((result) => {
            res.status(200).json({
                success: 'success',
                message: result[0]
            });
        })
        .catch((err) => {
            res.status(504).json({
                success: 'internal error',
                message: "try again please !!"
            });
        })
})

module.exports = router;