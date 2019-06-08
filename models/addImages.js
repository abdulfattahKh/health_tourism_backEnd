const db = require('../utilites/db');

// values: object that contains array of images and what is the kind of image 'clinic, procedure, travel or trip .
module.exports.addImage = function (values) {

    values.array.forEach(element => {
        const path = element.path;
        db.execute(
            `insert into images (image_path, clinics_id, travel_agency_id, procedures_id, trips_id) values (?, ?, ?, ?, ?)`,
            [path, values.clinicId ? values.clinicId : null, values.travelAgencyId ? travelAgencyId : null, values.procedures_id ? values.procedures_id : null, values.trips_id ? values.trips_id : null]
        );

    });


};