db = require('../utilites/db');
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
    this.address = values.address;

    this.mobileNumber = values.mobileNumber;
    this.phoneNumber = values.phoneNumber;

    this.userId = values.userId;
    this.clinicName = values.name;



    this.clinicTypes = values.clinicTypes;

  }

  // just make the id autoincrement
  save() {

    let clinicId;
    let locationId;

    return new Promise((resolve, reject) => {

      db.beginTransaction()
        .then(result => {
          console.log('Begin Transaction: ');
          return db.execute(
            `select * from locations where country_id=${this.clinicCountry} and   city_id=${this.clinicCity} and
                    state_id=${this.clinicState} and longitude=${this.longitude} and latitude=${this.latitude} ;`
          );
        })
        .then(result => {
          if (!result[0][0]) {
            return db.execute(
              `insert into locations (longitude, latitude, country_id, city_id, state_id)values (?, ?, ?, ?, ?);`,
              [this.longitude, this.latitude, this.clinicCountry, this.clinicCity, this.clinicState]
            );
          }
        })
        .then(result => {
          return db.execute(
            `select * from locations where country_id=${this.clinicCountry} and city_id=${this.clinicCity} and state_id=${this.clinicState} and longitude=${this.longitude} and latitude=${this.latitude};`
          );
        })
        .then(result => {
          locationId = result[0][0].location_id;
          return db.execute(
            `insert into clinics (name, mobile_number, phone_number, address, user_id, location_id) values (?, ?, ?, ?, ?, ?)`,
            [this.clinicName, this.mobileNumber, this.phoneNumber, this.address, this.userId, locationId]
          );
        })
        .then(result => {
          clinicId = result[0].insertId;

          return new Promise((rs, rj) => {

            this.clinicTypes.forEach(type => {
              db.execute(
                  `insert into specializations_clinics (specialization_id, clinic_id) values (?, ?)`,
                  [type, clinicId]
                )
                .then(result => {
                  rs();
                })
                .catch(err => {
                  rj({
                    err: err
                  });
                })
            })
          })
        })
        .then(result => {
          return db.commit();
        })
        .then(result => {
          console.log('Transaction Completed!!');
          resolve({
            success: true,
            message: 'Adding clinic sucessfully.',
            status: 200,
            id: clinicId
          })
        })
        .catch(err => {
          console.log('Failed!');
          db.rollback();
          reject({
            success: false,
            status: 500,
            message: 'Adding clinic failed!',
            err: err.err ? err.err : err
          });
        });
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
    select specializations_clinics_id as id, specialization_id , name from specializations_clinics S inner join specializations fuck on S.specialization_id = fuck.spec_id
    where S.clinic_id = ?
    `, [clinicId])
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
    l.latitude,
    l.longitude,
    c.description,
    c.address,
    c.phone_number as 'clinicPhoneNumber',
    c.mobile_number as 'clinicMobileNumber',
    c.name as 'clinicName',
    co.country_name as 'country',
    ci.city_name as 'city',
    st.state_name as 'state',
    us.first_name as 'fOwnerName',
    us.last_name as 'lOwnerName',
    us.email,
    us.mobile_number as 'userMobileNumber',
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

  static getClinicCountry(clinicId) {

    return db.execute(
      `select countries.country_id, countries.country_name from clinics left join
       locations on clinics.location_id=locations.location_id left join
       countries on locations.country_id=countries.country_id where clinics.id=?`,
      [clinicId]
    );

  };

  static getClinicCity(clinicId) {
    return db.execute(
      `select cities.city_id, cities.city_name from clinics left join
       locations on clinics.location_id=locations.location_id left join
       cities on locations.city_id=cities.city_id where clinics.id=?`,
      [clinicId]
    );
  }


  static getClinicState(clinicId) {
    return db.execute(
      `select states.state_id, states.state_name from clinics left join
       locations on clinics.location_id=locations.location_id left join
       states on locations.state_id=states.state_id where clinics.id=?`,
      [clinicId]
    );
  }


  static putUpdateClinic(clinicId, clinic) {

    clinic.name = clinic.name ? clinic.name : null;
    clinic.description = clinic.description ? clinic.description : null;
    clinic.phoneNumber = clinic.phoneNumber ? clinic.phoneNumber : null;
    clinic.mobileNumber = clinic.mobileNumber ? clinic.mobileNumber : null;
    clinic.address = clinic.address ? clinic.address : null;

    let locationId;

    return new Promise((resolve, reject) => {

      db.beginTransaction()
        .then(result => {
          return db.execute(
            `select * from locations where longitude=${clinic.longitude} and latitude=${clinic.latitude} and country_id=${clinic.country} and city_id=${clinic.city} and state_id=${clinic.state}`
          )
        })
        .then(result => {
          if (!result[0][0]) {
            return db.execute(
              `insert into locations (longitude, latitude, country_id, city_id, state_id) values (?, ?, ?, ?, ?)`,
              [clinic.longitude, clinic.latitude, clinic.country, clinic.city, clinic.state]
            );
          }
        })
        .then(result => {
          return db.execute(
            `select * from locations where longitude=${clinic.longitude} and latitude=${clinic.latitude} and country_id=${clinic.country} and city_id=${clinic.city} and state_id=${clinic.state}`
          )
        })
        .then(result => {
          locationId = result[0][0].location_id;
          return db.execute(
            `update clinics set name=?, description=?, mobile_number=?, phone_number=?, location_id=?, address=? where id=?`,
            [clinic.name, clinic.description, clinic.mobileNumber, clinic.phoneNumber, locationId, clinic.address, clinicId]
          );
        })
        .then(result => {
          return db.execute(
            `delete from specializations_clinics where clinic_id=?`,
            [clinicId]
          );
        })
        .then(result => {
          return new Promise((rs, rj) => {
            clinic.clinicTypes.forEach(type => {
              db.execute(
                  `insert into specializations_clinics (specialization_id, clinic_id) values (?, ?)`,
                  [type, clinicId]
                )
                .then(result => {
                  rs();
                })
                .catch(err => {
                  db.rollback();
                  rj({
                    err: err
                  });
                })
            });

          })
        })
        .then(result => {
          db.commit();
        })
        .then(result => {
          resolve({
            success: true,
            status: 200,
            message: 'Updating clinic successfully.'
          });
        })
        .catch(err => {
          reject({
            success: false,
            status: 500,
            message: 'Updating clinic failed!',
            err: err.err != undefined ? err.err : err
          });
        })

    });
  }

  static getClinicTypesById(clinicId) {

    return db.execute(
      `select specializations.name from clinics inner join specializations_clinics
       on clinics.id=specializations_clinics.clinic_id inner join specializations
       on specializations_clinics.specialization_id=specializations.spec_id where clinics.id=?`,
      [clinicId]
    );

  }


  static addRequestOfTreatment(values) {
    return db.execute(
      `insert into applications (first_name, last_name, email, mobile_number, specialization_id, info, clinic_id, users_id) values (?, ?, ?, ?, ?, ?, ?, ?)`,
      [values.firstName, values.lastName, values.email, values.mobileNumber, values.specializationId, values.info, values.clinicId, values.userId]
    );
  }

  static getOwnerOfClinic(clinicId) {
    return db.execute(
      `select userId from clinics where id=?`,
      [clinicId]
    );
  }

  static getRequestTreatment(requestId) {
    return db.execute(
      `select * from applications where id=?`,
      [requestId]
    );
  }

  static getImagesOfRequestTreatment(requestId) {
    return db.execute(
      `select image_id, image_name from images where application_id=?`,
      [requestId]
    );
  }

  static search(procedureId, countryId, cityId, stateId) {
    return db.execute(`select 
    clinics.name as clinicName,
    clinics.description as clinicDescription,
    clinics.address as clinicAddress,
    clinics.mobile_number as clinicMobileNumber,

    countries.country_name as country,
    cities.city_name as city,
    states.state_name as state,

    CONCAT(users.first_name ,' ', users.last_name) as 'userName',
    images.image_name 
    from clinics
    inner join locations on clinics.location_id  = locations.location_id
    inner join countries on countries.country_id = locations.country_id
    inner join cities on cities.city_id = locations.city_id
    inner join states on states.state_id = locations.state_id
    inner join users on users.id = clinics.user_id 
    left join images on images.clinics_id = clinics.id
    group by clinics.id`);
    let query = "";
    if (procedureId && procedureId != "" &&
      countryId && countryId != "" &&
      cityId && cityId != "" &&
      stateId && stateId != ""
    ) {
      query = this.getSearchQuery() +
        ` where procedures.id = ? 
        and cities.city_id = ? 
        and countries.country_id = ? 
        and states.state_id = ?
        group by clinics.id`

      return db.execute(query, [procedureId, countryId, cityId, stateId]);
    } else if (procedureId && procedureId != "" &&
      countryId && countryId != ""
    ) {
      query = this.getSearchQuery() +
        ` where procedures.id = ? 
         and cities.city_id = ?
         group by clinics.id`
      return db.execute(query, [procedureId, countryId]);
    } else if (procedureId && procedureId != "") {
      query = this.getSearchQuery() +
        ` where procedures.id = ? 
        group by clinics.id`
      return db.execute(query, [procedureId]);
    }
  }



  static getSearchQuery() {
    let sql = `select 

              clinics.name as clinicName,
              clinics.description as clinicDescription,
              clinics.address as clinicAddress,
              clinics.mobile_number as clinicMobileNumber,
              
              countries.country_name,
              cities.city_name,
              states.state_name,
              
              CONCAT(users.first_name ,' ', users.last_name) as 'userName'
              
              from clinics
              inner join locations on clinics.location_id  = locations.location_id
              inner join countries on countries.country_id = locations.country_id
              inner join cities on cities.city_id = locations.city_id
              inner join states on states.state_id = locations.state_id
              inner join users on users.id = clinics.user_id
              inner join specializations_clinics on specializations_clinics.clinic_id = clinics.id
              inner join specializations on specializations.spec_id = specializations_clinics.specialization_id
              inner join proc_spec_clinic on proc_spec_clinic.spec_clinic_id = specializations_clinics.specializations_clinics_id
              inner join procedures on procedures.id = proc_spec_clinic.proc_id
              left join images on images.clinics_id = clinics.id`
    return sql;
  }
  // where procedures.id = ? and cities.city_id = ? and countries_id = ? and states.state_id = ?
  // group by clinics.clinic_id`
}




/* TO GET ALL CLINICS THAT HAVE THE REQUIRED QRETIRIA*/