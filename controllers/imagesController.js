const imagesModule = require('../models/images');

exports.addImages = (req, res, next) => {
    let data = [];
    req.files.forEach((image, id) => {
        data.push({
            id: id,
            name: image.filename
        });
    })
    return res.json({
        success: true,
        message: 'images names',
        data: data
    })
}

/*
obj = {
    hotelId:number,
    array:images
}
*/
exports.addImagesById = obj => {

    return imagesModule.addImages(obj)
}