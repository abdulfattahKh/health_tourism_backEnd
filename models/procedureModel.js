/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @start
 * 
 */
const db = require("../utilites/db");
const dbPool = require("../utilites/dbPool");
const addImage = require("./addImages");


module.exports = class Procedure {
    constructor(values) {
        this.id = values.id;
        this.name = values.name;
        this.specializations_spec_id = values.spec_id;
    }

    // save(){

    //     var isSpecAlreadyExist = `SELECT * FROM health_tourism.specializations_clinics WHERE ${this.clinicCity} = 1 ;`
    //     return db.beginTransaction()
    //             .then(result => {
    //                 return db.execute(
    //                   `select * from locations where country_id=${
    //                     this.clinicCountry
    //                 } and   city_id=${this.clinicCity} and
    //                     state_id=${this.clinicState};`
    //                 );
    //             })
    // }

};
/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @end
 * 
 */