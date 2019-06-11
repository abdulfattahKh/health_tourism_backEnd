/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @start
 * 
 */
const db = require("../utilites/db");
<<<<<<< HEAD
// const addImage = require("./addImages");
=======
const addImage = require("./Images");
>>>>>>> 1c795b5c7d2367a8f0c5a06cec9ee52964f0b4d4


module.exports = class specializationsClinics {
    constructor(values) {
        // this.specializations_clinics_id = values.spec_clinics_id;
        this.spec_id = values.spec_id;
        this.clinic_id = values.clinic_id;
        this.table = "specializations_clinics";
    }

    /// select by foreign keys ....
    static fKeysSelect(spec_id , clinic_id){
        this.table = "specializations_clinics";
        var isAlreadyExist = `SELECT * FROM health_tourism.${this.table} WHERE
                    specialization_id = ${spec_id} AND clinic_id = ${clinic_id} ;`
        
        return db.execute(isAlreadyExist)
                    .then(result => {                        
                        return result[0][0] ;
                    })
                    .catch(err => {
                        console.log(err);                        
                        return false;
                    });    
        

    }/// end fKeysSelect()

    save(){
        
        var isAlreadyExist = `SELECT * FROM health_tourism.${this.table} WHERE
                    specialization_id = ${this.spec_id} AND clinic_id = ${this.clinic_id} ;`
                    
        var newRecorde = `INSERT INTO health_tourism.${this.table} (specialization_id, clinic_id) VALUES (?,?);`
        
        var values = [ this.spec_id , this.clinic_id ]

        return db.beginTransaction()
                .then(result => {
                    return db.execute(isAlreadyExist);
                })
                .then(result => {
                    if (!result[0][0]) {
                        console.log("specializationsClinicsModel.save() \'new\' ");
                        return db.execute(newRecorde,values);
                    }
                    return [{
                        "insertId" : result[0][0].specializations_clinics_id
                    }] ;
                })
                .then(result => {
                    db.commit();
                    return result[0].insertId;
                })
                .then(result => {
                    return result;
                })
                .catch(err => {
                    console.log(err);
                    db.rollback();
                    return false;
                });

    } /// end save()

    delete(){
        return db.beginTransaction()
                .then(result => {
                    return specializationsClinics.fKeysSelect(this.spec_id , this.clinic_id)
                })
                .then(result => {
                    if (!result) {
                        return false;
                    }
                    var deleteRecord = `DELETE FROM health_tourism.${this.table}
                                        WHERE specialization_id = ${this.spec_id} AND clinic_id = ${this.clinic_id} ;`

                    db.execute(deleteRecord)
                        .then(res=>{
                            console.log("specializationsClinicsModel.delete() -------> " + res[0]);     
                            return res[0];
                        })
                        .catch(err=>{
                            throw err;
                        })
                })
                .then(result => {
                    db.commit();
                    return result;
                })
                .then(result => {
                    return result;
                })
                .catch(err => {
                    console.log(err);
                    db.rollback();
                    return false;
                });

    }//// end delete()

    static viewAccordClinic(clinic_id){
        this.table = "specializations_clinics";
        var query = `SELECT * FROM  health_tourism.${this.table} WHERE clinic_id=${clinic_id}`;

        return db.execute(query)
            .then(result => {   
                return result[0];             
            })
    }/// end viewAccordClinic()

};

/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @end 
 * 
 */