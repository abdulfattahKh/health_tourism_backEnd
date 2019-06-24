const hotelModel = require('../models/hotelsModel');


exports.addHotel = (req,res,next)=>{
    hotelModel.addHotel();
}