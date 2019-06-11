const db = require('../utilites/db');
const fs = require('fs');


exports.getImageById = (imageId) => {
    return db.execute(`select * from images where image_id=?`, [imageId]);
};


// values: object that contains array of images and what is the kind of image 'clinic, procedure, travel or trip .


exports.addImages = (values) => {
    const data = [];

    return new Promise((resolve, reject) => {
        values.array.forEach(element => {
            data.push(element.filename);
            const path = element.path;
            db.execute(`insert into images (image_path, clinics_id) values (?, ?)`, [path, values.clinicId])
                .then(result => {
                    resolve({ success: true, message: 'Adding images successfully.', data: data });
                })
                .catch(err => {
                    reject({ err: err, success: false, message: 'Internal server error!' })
                });
        });

    });

};


exports.deleteImageFromDataBase = (imageId) => {
    return db.execute(`delete from images where image_id=?`, [imageId]);
};


exports.deleteImageFromFolder = (path, imageId) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) {
                reject({ status: 500, err: err, success: false, message: 'Deleting image failed!' });
            } else {
                resolve({ status: 200, success: true, message: 'Deleting image successfully.' });
            }
        });
    })
};