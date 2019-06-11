const db = require('../utilites/db');
const dbPool = require('../utilites/dbPool');


// values{clinicType: @example, .... }
module.exports = class Clinic {
    constructor(values) {
        // location
        this.clinicCountry = values.country;
        this.clinicCity = values.city;
        this.clinicState = values.state;
        this.longitude = values.longitude;
        this.latitude = values.latitude;

        this.mobileNumber = values.mobileNumber;
        this.phoneNumber = values.phoneNumber;

        this.userId = values.userId;
        this.clinicName = values.name;

        this.clinicTypes = values.clinicTypes;


    }

    // just make the id autoincrement
    save(addMultipleTypes) {
        let clinicId;
        let locationId;

        return db.beginTransaction()
            .then(result => {
                console.log('Begin Transaction: ');
                return db.execute(
                    `select * from locations where country_id=${this.clinicCountry} and   city_id=${this.clinicCity} and
                    state_id=${this.clinicState};`
                );
            })
            .then(result => {
                console.log('omar');
                if (!result[0][0]) {
                    return db.execute(
                        `insert into locations (longitude, latitude, country_id, city_id, state_id)values (?, ?, ?, ?, ?);`,
                        [this.longitude, this.latitude, this.clinicCountry, this.clinicCity, this.clinicState]
                    );
                }
            })
            .then(result => {
                console.log('ahmad');
                return db.execute(
                    `select * from locations where country_id=${this.clinicCountry} and city_id=${this.clinicCity} and state_id=${this.clinicState};`
                );
            })
            .then(result => {
                console.log('waledd');
                locationId = result[0][0].location_id;
                return db.execute(
                    `insert into clinics (name, mobile_number, phone_number, user_id, location_id) values (?, ?, ?, ?, ?)`,
                    [this.clinicName, this.mobileNumber, this.phoneNumber, this.userId, locationId]
                );
            })
            .then(result => {
                console.log('samer');
                return db.execute(
                    `select * from clinics order by id desc limit 1;`
                );
            })
            .then(result => {
                console.log('salim');
                clinicId = result[0][0].id;
                // console.log(clinicId, this.clinicTypes);
                // console.log(addMultipleTypes(clinicId, this.clinicTypes));
                return addMultipleTypes(clinicId, this.clinicTypes);
                // return db.execute(
                //     `insert into specializations_clinics (specialization_id, clinic_id) values (?, ?)`,
                //     [this.clinicType, clinicId]
                // );
            })
            .then(result => {
                console.log('mm');
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

    // static getAllClinics() {
    //     return db.execute(`select * from clinics
    //     left join locations on clinics.location_id=locations.location_id
    //     left join specializations_clinics on specializations_clinics.clinic_id=clinics.id
    //     left join specializations on specializations.spec_id=specializations_clinics.specialization_id
    //     left join users on clinics.user_id=users.id;`);
    // }

    static getClinicTypes() {
        return db.execute(`select * from specializations;`);
    }


    // static getClinicsStatus() {
    //     return db.execute(`select * from clinics
    //     left join locations on clinics.location_id=locations.location_id
    //     left join specializations_clinics on specializations_clinics.clinic_id=clinics.id
    //     left join specializations on specializations.spec_id=specializations_clinics.specialization_id
    //     left join users on clinics.user_id=users.id
    //     where clinics.status='pending'`);
    // }

    // static getAllClinicsOfAnUser(userId) {
    //     return db.execute(
    //         `select * from clinics
    //     left join locations on clinics.location_id=locations.location_id
    //     left join specializations_clinics on specializations_clinics.clinic_id=clinics.id
    //     left join specializations on specializations.spec_id=specializations_clinics.specialization_id
    //     left join images on clinics.id=images.clinics_id
    //     left join clinics_doctors on clinics.id=clinics_doctors.clinic_id
    //     left join doctors on clinics_doctors.doctor_id=doctors.id
    //     left join clinics_procedures on clinics_procedures.clinic_id=clinics.id
    //     left join procedures on clinics_procedures.procedure_id=procedures.id
    //     where clinics.user_id=?`,
    //         [userId]
    //     );
    // }

    static changeClinicStatus(clinicId, status) {
        return db.execute(
            `update clinics set status=? where id=?`,
            [status, clinicId]
        );
    }

    static deleteClinciById(clinicId) {
        return db.execute(
            `delete from clinics where id=?`,
            [clinicId]
        );
    }


    static getAllClinics() {
        return db.execute(
            `select * from clinics 
      inner join users on clinics.user_id = users.id
      inner join locations on clinics.location_id = locations.location_id 
      `
        );
    }

    static getMyClinics(userId) {
        return db.execute(
            `select * from clinics 
      inner join users on clinics.user_id = users.id 
      inner join locations on clinics.location_id = locations.location_id
      where clinics.user_id = ?`,
            [userId]
        );
    }

    static getClinicsByStatus(status) {
        return db.execute(
            `
                select * from clinics 
                inner join locations on clinics.location_id = locations.location_id
                where clinics.status = ?
            `,
            [status]
        );
    }

}

