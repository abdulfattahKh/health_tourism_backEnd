const db = require('../utilites/db');

const fs = require('fs');


module.exports = class Doctor {

    constructor(values) {

        this.firstName = values.firstName ? values.firstName : null;
        this.lastName = values.lastName ? values.lastName : null;
        this.gender = values.gender ? values.gender : null;
        this.imagePath = values.imageName ? values.imageName : null;
        this.mobileNumber = values.mobileNumber ? values.mobileNumber : null;
        this.phoneNumber = values.phoneNumber ? values.phoneNumber : null;

    }


    save(clinicId) {
        let doctorId;
        return new Promise((resolve, reject) => {
            db.beginTransaction()
                .then(result => {
                    return db.execute(
                        `select * from doctors where mobile_number=?`,
                        [this.mobileNumber]
                    );
                })
                .then(result => {
                    if (!result[0][0]) {
                        return db.execute(
                            `insert into doctors (first_name, last_name, gender, image_name, phone_number, mobile_number) values (?, ?, ?, ?, ?, ?)`,
                            [this.firstName, this.lastName, this.gender, this.imagePath, this.phoneNumber, this.mobileNumber]
                        );
                    } else {
                        throw new Error('This doctor is already exists.');
                        doctorId = result[0][0].id;
                    }
                })
                .then(result => {
                    if (!doctorId) {
                        doctorId = result[0].insertId;
                    }
                })
                .then(result => {
                    return db.execute(
                        `insert into clinics_doctors (clinic_id, doctor_id) values (?, ?)`,
                        [clinicId, doctorId]
                    );
                })
                .then(result => {
                    return db.commit();
                })
                .then(result => {
                    console.log('Adding doctors successfully.');
                    resolve({ success: true, status: 200, message: 'Adding doctor successfully.', doctorId: doctorId })
                })
                .catch(err => {
                    console.log(err);
                    if (err.message) {
                        err.status = 421;
                    } else {
                        err.message = 'Adding doctor failed!';
                        err.status = 500;
                    }
                    db.rollback();
                    reject({ success: false, status: err.status, message: err.message, err: err })
                })
        });
    }

    static deleteDoctor(doctorId) {
        return db.execute(`delete from doctors where id=?`, [doctorId]);
    }

    static updateDoctor(doctorId, data) {

        data.firstName = (data.firstName ? data.firstName : null);
        data.lastName = (data.lastName ? data.lastName : null);
        data.gender = (data.gender ? data.gender : null);
        data.imagePath = (data.imagePath ? data.imagePath : null);
        data.phoneNumber = (data.phoneNumber ? data.phoneNumber : null);
        data.mobileNumber = (data.mobileNumber ? data.mobileNumber : null);

        return db.execute(
            `update doctors set first_name=?, last_name=?, gender=?, image_name=?, phone_number=?, mobile_number=? where id=?`,
            [data.firstName, data.lastName, data.gender, data.imagePath, data.phoneNumber, data.mobileNumber, doctorId]
        );
    }

    static getDoctorById(doctorId) {
        return db.execute(
            `select * from doctors where doctors.id=${doctorId}`
        );
    }

    static getAllDoctorsByClinicId(clinicId) {

        return db.execute(
            `select doctors.id, doctors.first_name, doctors.last_name, doctors.gender, doctors.image_name, doctors.phone_number, doctors.mobile_number from clinics inner join clinics_doctors
             on clinics.id=clinics_doctors.clinic_id inner join doctors
             on clinics_doctors.doctor_id=doctors.id where clinics.id=?`,
            [clinicId]
        );
    }

    static addExperiencesToDoctor(experinces, doctorId) {

        const data = [];

        return new Promise((resolve, reject) => {

            experinces.forEach(experince => {

                db.execute(
                    `insert into experinces (organization_name, experince_name, doctor_id)values (?, ?, ?)`,
                    [experince.organizationName, experince.experinceName, doctorId]
                )
                    .then(result => {
                        data.push({ id: result[0].insertId });
                        if (data.length === experinces.length) {
                            resolve({ success: true, message: 'Adding experinces successfully.', data: data, status: 200 })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        reject({ success: false, status: 500, message: 'Adding experinces faile!', err: err });
                    })
            });
        });

    }

    static addImage(name, doctorId) {

        return db.execute(
            `update doctors set image_name=? where id=?`,
            [name, doctorId]
        );

    }


    static deleteImage(doctorId) {

        let imagePath;

        return new Promise((resolve, reject) => {

            db.execute(
                `select image_name from doctors where id=?`,
                [doctorId]
            )
                .then(result => {
                    imagePath = result[0][0].image_name;
                    return db.execute(
                        `update doctors set image_name=NULL where id=?`,
                        [doctorId]
                    )
                })
                .then(result => {
                    fs.unlink('upload/images/doctors/' + imagePath, err => {

                        if (err) {
                            db.rollback();
                            reject({ success: false, message: 'Deleting image failed!', status: 500, err: err });
                        }
                        resolve({ success: true, message: 'Deleting image successfully.', status: 200 });
                    })
                })
                .then(result => {
                    return db.commit();
                })
                .then(result => {
                    console.log('Completed!!!');
                })
                .catch(err => {
                    db.rollback();
                    reject({ success: false, message: 'Deleting image failed!', status: 500, err: err });
                })

        })
    }

    static getAllExperincesByDoctorId (doctorId) {

        return db.execute(
            `select experinces.experince_name, experinces.organization_name, experinces.from, experinces.to, experinces.createdAt, experinces.updatedAt from experinces inner join doctors
             on experinces.doctor_id=doctors.id where doctors.id=?`,
             [doctorId]
        );

    }

}
