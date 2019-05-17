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

    // addClinic
    save() {
        return execute(``, []);
    }

    static getClinicTypes() {
        return db.execute(``);
    }
}

