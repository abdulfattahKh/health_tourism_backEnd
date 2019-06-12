const db = require("../utilites/db");
const dbPool = require("../utilites/dbPool");
const addImage = require("./addImages");
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
    let locationId;

    return (
      db
        .beginTransaction()
        .then(result => {
          console.log("Begin Transaction: ");
          return db.execute(
            `select * from locations where country_id=${
              this.clinicCountry
            } and   city_id=${this.clinicCity} and
                state_id=${this.clinicState};`
          );
        })
        .then(result => {
          console.log("omar");
          if (!result[0][0]) {
            return db.execute(
              `insert into locations (longitude, latitude, country_id, city_id, state_id)values (?, ?, ?, ?, ?);`,
              [
                this.longitude,
                this.latitude,
                this.clinicCountry,
                this.clinicCity,
                this.clinicState
              ]
            );
          }
        })
        .then(result => {
          console.log("ahmad");
          return db.execute(
            `select * from locations where country_id=${
              this.clinicCountry
            } and city_id=${this.clinicCity} and state_id=${this.clinicState};`
          );
        })
        .then(result => {
          console.log("waledd");
          locationId = result[0][0].location_id;
          return db.execute(
            `insert into clinics (name, descreption, user_id, location_id) values (?, ?, ?, ?)`,
            [this.clinicName, this.clinicDescreption, this.userId, locationId]
          );
        })
        .then(result => {
          console.log("samer");
          return db.execute(`select * from clinics order by id desc limit 1;`);
        })
        .then(result => {
          console.log("salim");
          clinicId = result[0][0].id;
          return db.execute(
            `insert into specializations_clinics (specialization_id, clinic_id) values (?, ?)`,
            [this.clinicType, clinicId]
          );
        })
        // .then(result => {
        //     console.log('mo');
        //     if (this.files) {
        //       return addImage.addImage({ clinicId: clinicId, array: this.files });
        //     }
        // })
        .then(result => {
          console.log("mm");
          return db.commit();
        })
        .then(result => {
          console.log("Transaction Completed!!");
          return true;
        })
        .catch(err => {
          console.log(err);
          console.log("There is an erro!!");
          db.rollback();
          return false;
        })
    );
  }

  static getClinicTypes() {
    return db.execute(`select * from specializations;`);
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
  static getClinicTypes() {
    return db.execute(`select * from specializations;`);
  }
  static changeClinicStatus(clinicId, status) {
    return db.execute(`update clinics set status=? where id=?`, [
      status,
      clinicId
    ]);
  }
  static deleteClinciById(clinicId) {
    return db.execute(`delete from clinics where id=?`, [clinicId]);
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
};
