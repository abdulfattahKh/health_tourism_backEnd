const db = require('../utilites/db');


module.exports = class Doctor {

    constructor(values) {

        this.firstName = values.firstName ? values.firstName : null;
        this.lastName = values.lastName ? values.lastName : null;
        this.gender = values.gender ? values.gender : null;
        this.imagePath = values.imagePath ? values.imagePath : null;
        this.mobileNumber = values.mobileNumber ? values.mobileNumber : null;
        this.phoneNumber = values.phoneNumber ? values.phoneNumber : null;

    }


    save(clinicId) {
        let doctorId;
        return new Promise((resolve, reject) => {
            db.beginTransaction()
                .then(result => {
                    return db.execute(
                        `insert into doctors (first_name, last_name, gender, image_path, phone_number, mobile_number) values (?, ?, ?, ?, ?, ?)`,
                        [this.firstName, this.lastName, this.gender, this.imagePath, this.phoneNumber, this.mobileNumber]
                    );
                })
                .then(result => {
                    return db.execute(`select * from doctors order by id desc limit 1`);
                })
                .then(result => {
                    console.log(result[0]);
                    doctorId = result[0][0].id;
                    return db.execute(`insert into clinics_doctors (clinic_id, doctor_id) values (?, ?)`, [clinicId, doctorId])
                })
                .then(result => {
                    console.log('Gere');
                    return db.commit();
                })
                .then(result => {
                    console.log('Adding doctors successfully.');
                    resolve({ success: true, status: 200, message: 'Adding doctor successfully.' })
                })
                .catch(err => {
                    console.log(err);
                    db.rollback();
                    reject({ success: false, status: 500, message: 'Adding doctor failed!', err: err })
                })
        });
    }

    static deleteDoctor(doctorId) {
        return db.execute(`delete from doctors where id=?`, [doctorId]);
    }

    static updateDoctor(doctorId, data) {
        return db.execute(
            `update doctors set first_name=?, last_name=?, gender=?, image_path=?, phone_number=?, mobile_number=? where id=?`,
            [data.firstName, data.lastName, data.gender, data.imagePath, data.phoneNumber, data.mobileNumber, doctorId]
        );
    }

    static getAllDoctorsByClinicId(clinicId) {

        return db.execute(
            `select `
        );

    }

}
