const db = require("../utilites/db");
const dbPool = require("../utilites/dbPool");
const addImage = require("./addImages");
// values{clinicType: @example, .... }
module.exports = class Clinic {
  constructor(values) {
    console.log(values);
    this.userId = values.userId;
    this.clinicType = values.clinicTypes;
    this.clinicName = values.name;
    this.clinicCountry = values.country;
    this.clinicCity = values.city;
    this.clinicState = values.state;
    this.longitude = values.longitude;
    this.latitude = values.latitude;
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
          console.log(locationId);
          console.log(this.clinicName);
          console.log(this.userId);

          return db.execute(
            `insert into clinics (name, user_id, location_id) values (? , ?, ?)`,
            [this.clinicName, this.userId, locationId]
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
        //         return addImage.addImage({ clinicId: clinicId, array: this.files });
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
      this.getClinicInfoQuery()
    );
  }


  static getMyClinics(userId) {

    return db.execute(this.getClinicInfoQuery() + "where c.user_id = ?",[userId]);

  }
  static getClinicTypes() {

    return db.execute(`select * from specializations;`);

  }

  static deleteClinciById(clinicId) {

    return db.execute(`delete from clinics where id=?`, [clinicId]);

  }

  static getClinicsByStatus(status) {

    return db.execute(this.getClinicInfoQuery()+'where c.status = ?',[status]);

  }

  static getClinicInfoQuery() {
    
    return (this.sql =`select 
    c.id,
    c.name as 'clinicName',
    co.country_name as 'country',
    ci.city_name as 'city',
    st.state_name as 'state',
    us.first_name as 'fOwnerName',
    us.last_name as 'lOwnerName',
    us.email,
    us.mobile_number as '',
    c.status
    from clinics c 
    inner join locations l on c.location_id = l.location_id
    inner join countries co on l.country_id = co.country_id
    inner join cities ci on ci.city_id = l.city_id
    inner join states st on st.state_id = l.state_id
    inner join users us on us.id = c.user_id
    `)
  }
};
