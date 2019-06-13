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
        console.log(err);
        console.log('There is an erro!!');
        db.rollback();
        return false;
      });
  }



  static getClinicTypes() {
    return db.execute(`select * from specializations;`);
  }

  static changeClinicStatus(clinicId, status) {
    return db.execute(
      `update clinics set status=? where id=?`,
      [status, clinicId]
    );
  }



  static getAllClinics() {
    return db.execute(
      this.getClinicInfoQuery()
    );
  }


  static getMyClinics(userId) {

    return db.execute(this.getClinicInfoQuery() + "where c.user_id = ?", [userId]);

  }

  static getClinicById(clinicId) {
    return db.execute(this.getClinicInfoQuery() + "where c.id = ?", [clinicId])
  }

  static getClinicTypesById(clinicId) {
    return db.execute(`
    select specialization_id , name from specializations_clinics S inner join specializations fuck on S.specialization_id = fuck.spec_id
where S.clinic_id = 25
`)
  }

  static deleteClinciById(clinicId) {

    return db.execute(`delete from clinics where id=?`, [clinicId]);

  }

  static getClinicsByStatus(status) {

    return db.execute(this.getClinicInfoQuery() + 'where c.status = ?', [status]);

  }

  static getClinicInfoQuery() {

    return (this.sql = `select 
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

  // just make the id autoincrement



  static changeClinicStatus(clinicId, status) {
    return db.execute(
      `update clinics set status=? where id=?`,
      [status, clinicId]
    );
  }
}