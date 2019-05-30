const db = require('../utilites/db');
const dbPool = require('../utilites/dbPool');



// values{clinicType: @example, .... }
module.exports = class Clinic {
    constructor(values) {
        this.userId = values.userId;
        this.clinicType = values.clinicType;
        this.clinicName = values.clinicName;
        this.clinicCountry = values.clinicCountry;
        this.clinicCity = values.clinicCity;
        this.clinicState = values.clinicState;
        // this.clinicMap = values.clinicMap;
    }


    // just make the id autoincrement
    save() {
        let clinicId;

        return db.beginTransaction()
            .then(result => {
                console.log('Begin Transaction: ');
                return db.execute(
                    `insert into clinics (id, name, user_id) values (?, ?, ?)`,
                    [7, this.clinicName, this.userId]
                );
            })
            .then(result => {
                return db.execute(
                    `select * from clinics order by id desc`
                );
            })
            .then(result => {
                clinicId = result[0][0].id;
                return db.execute(
                    `insert into locations (country_id, city_id, state_id, clinics_id) values (?, ?, ?, ?)`,
                    [this.clinicCountry, this.clinicCity, this.clinicState, clinicId]
                );
            })
            .then(result => {
                return db.execute(
                    `insert into specfghializations_clinics (specialization_id, clinic_id) values (?, ?)`,
                    [this.clinicType, clinicId]
                );
            })
            .then(result => {
                return db.commit();
            })
            .then(result => {
                console.log('Transaction Completed!!');
                return true;
            })
            .catch(err => {
                console.log('There is an erro!!');
                db.rollback();
                return false;
            });
    }

    static getClinicTypes() {
        return db.execute(`select * from specializations;`);
    }


    static getClinicsStatus() {
        return db.execute(`select * from clinics
        inner join locations on clinics.id=locations.clinics_id
        inner join clinics_doctors on clinics.id=clinics_doctors.clinic_id
        inner join doctors on clinics_doctors.doctor_id=doctors.id
        inner join clinics_procedures on clinics_procedures.clinic_id=clinics.id
        inner join procedures on clinics_procedures.procedure_id=procedures.id;`);
    }
}

