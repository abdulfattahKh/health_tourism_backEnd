/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @start
 * 
 */
const db = require("../utilites/db");

module.exports = class Procedure {
    constructor(values) {
        this.id = values.id;
        this.name = values.name;
        this.specializations_spec_id = values.spec_id;
        this.table = "procedures"
    }

    static viewAccordSpecId(spec_id){
        this.table = "procedures"
        var query = `SELECT * FROM health_tourism.${this.table} WHERE specializations_spec_id = ${spec_id};`

        return db.execute(query)
            .then( result => {
                if( !result[0] ){
                    return false;
                }
                return result[0];
            })
            .catch(err=>{
                throw err;
            })
    }

};
/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @end
 * 
 */