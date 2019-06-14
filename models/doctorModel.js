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
                    resolve({ success: true, status: 200, message: 'Adding doctor successfully.', doctorId: doctorId })
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

    static getDoctorById(doctorId) {
        return db.execute(
            `select * from doctors left join experinces
             on doctors.id=experinces.doctor_id where doctor.id=?`,
            [doctorId]
        );
    }

    static getAllDoctorsByClinicId(clinicId) {

        return db.execute(
            `select * from clinics left join clinics_doctors
             on clinics.id=clinics_doctors.clinic_id left join doctors
             on clinics_doctors.doctor_id=doctors.id left join experinces
             on doctors.id=experinces.doctor_id where clinics.id=?`,
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
                        data.push(result[0].insertId);
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

}
