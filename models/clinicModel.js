const db = require('../utilites/db');


module.exports = class Clinic{
    constructor(clinicType, clinicName, clinicAddress, clinicCountry, clinicCity, clinicState, clinicMap) {
        this.clinicType = clinicType;
        this.clinicName = clinicName;
        this.clinicAddress = clinicAddress;
        this.clinicCountry = clinicCountry;
        this.clinicCity = clinicCity;
        this.clinicState = clinicState;
        this.clinicMap = clinicMap;
    }


    static getClinicTypes() {
        return db.execute(`select * from specializations;`);
    }

    
    static getClinicsStatus() {
        return db.execute(`select * from clinics 
        inner join clinics_doctors on clinics.id=clinics_doctors.clinic_id
        inner join doctors on clinics_doctors.doctor_id=doctors.id
        inner join clinics_procedures on clinics_procedures.clinic_id=clinics.id
        inner join procedures on clinics_procedures.procedure_id=procedures.id;`);
    }
}

