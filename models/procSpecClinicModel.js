/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @start
 * 
 */
const db = require("../utilites/db");
const SpecClinicModel = require("./specializationsClinicsModel")

module.exports = class procSpecClinic {

    constructor(values) {
        this.proc_id = values.proc_id;
        this.spec_id = values.spec_id;
        this.clinic_id = values.clinic_id;
        this.min_price = values.min_price;
        this.max_price = values.max_price;
        this.duration = values.duration;
        this.num_visits = values.num_visits;
        this.bookable = values.bookable;
        this.description = values.description;
        this.img1 = values.img1;
        this.img2 = values.img2;
        this.spec_clinic_id = 0;
        this.table = "proc_spec_clinic";
    }

    static fKeysSelect(proc_id,spec_id,clinic_id){
        this.table = "proc_spec_clinic";

        return SpecClinicModel.fKeysSelect(spec_id , clinic_id)
            .then(result => {
                if( !result ){
                    return {
                        "status" : -2 ,
                        "data" : null
                    };
                }
                var isAlreadyExist = `SELECT * FROM health_tourism.${this.table} WHERE
                proc_id = ${proc_id} AND spec_clinic_id = ${result.specializations_clinics_id} ;`
                this.spec_clinic_id = result.specializations_clinics_id;
                
                return db.execute(isAlreadyExist)
                    .then(result => {  
                        if( !result[0][0] ){
                            return {
                                "status" : -1 ,
                                "data" : this.spec_clinic_id
                            };
                        }  
                        return {
                            "status" : 1 ,
                            "data" : result[0][0]
                        };
                    })
                    .catch(err => {
                        return {
                            "status" : -3 ,
                            "data" : err
                        };
                    });
                return result;
            });
        
    }/// end fKeysSelect()

    save(){

        var newRecorde = `INSERT INTO health_tourism.${this.table} (proc_id,spec_clinic_id,min_price,max_price,duration,num_visits,bookable,description,img1,img2) VALUES (?,?,?,?,?,?,?,?,?,?);`
        var values = [this.proc_id,this.spec_clinic_id,this.min_price,this.max_price,this.duration,this.num_visits,this.bookable,this.description,this.img1,this.img2]        
        this.initValues(values);

        return db.beginTransaction()
                .then(result => {
                    return procSpecClinic.fKeysSelect(this.proc_id,this.spec_id,this.clinic_id);
                })
                .then(result => {
                    /// clinic does not have spec belong to proc yet !!
                    if(result.status == -2){
                        obj = new SpecClinicModel({
                            "spec_id"   : this.spec_id ,
                            "clinic_id" : this.clinic_id
                        });
                        obj.save() 
                            .then(res=>{
                                console.log("<2> procSpecClinicModel.save() \'new\' ");
                                values[1] = res
                                db.execute(newRecorde,values)
                                    .then(result => {
                                        return true;
                                    })
                            });
                        
                        
                    }else if(result.status == -1){
                        console.log("procSpecClinicModel.save() \'new\' ");                        
                        values[1] = result.data
                        
                        db.execute(newRecorde,values)
                            .then(result => {
                                return true;
                            })    
                    }else if (result.status == 1){
                        /// update stored recorde 
                        console.log("Updating Process ...");
                        this.checkForUpdatedColumns(result.data,values);
                        var updateRecorde = `UPDATE health_tourism.${this.table} 
                                            SET min_price=${values[2]},max_price=${values[3]},duration=${values[4]},num_visits=${values[5]},bookable=${values[6]},description="${values[7]}",img1="${values[8]}",img2="${values[9]}"
                                            WHERE proc_id=${values[0]} AND spec_clinic_id=${values[1]} `;
                        
                        db.execute(updateRecorde)
                            .then(res=>{
                                // return res[0].insertId ;
                                return res[0]
                            })
                            .catch(err => {
                                throw err;
                            });

                    }else if (result.status == -3){
                        throw result.data;
                    }
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
                
    } /// end save()

    delete(){

        return db.beginTransaction()
                .then(result => {
                    return procSpecClinic.fKeysSelect(this.proc_id,this.spec_id,this.clinic_id);
                })
                .then(result => {
                    if (result.status != 1){
                        throw result.data;
                    }
                    /// delete stored recorde 
                    console.log("Delete Process ...");
                    let spec_clinic_id = result.data.spec_clinic_id;
                    var deleteRecorde = `DELETE FROM health_tourism.${this.table} 
                                            WHERE proc_id=${this.proc_id} AND spec_clinic_id=${spec_clinic_id} `;
                    
                    db.execute(deleteRecorde)
                        .then(res=>{
                            console.log("procSpecClinicModel.delete() -------> " + res[0]);     
                            return res[0] ;
                        })
                        .catch(err => {
                            throw err;
                        });
                    
                    var checkForMoreProc = `SELECT * FROM health_tourism.${this.table} WHERE spec_clinic_id=${spec_clinic_id}`;
                    
                    db.execute(checkForMoreProc)
                        .then(res=>{                            
                            if(!res[0][0]){
                                /// no more other procedure
                                obj = new SpecClinicModel({
                                    "spec_id"   : this.spec_id ,
                                    "clinic_id" : this.clinic_id
                                })
                                obj.delete()
                            }
                        })
                        .catch(err => {
                            throw err;
                        });

                })
                .then(result => {
                    db.commit();
                    return result ;
                })
                .then(result => {
                    return result ;
                })
                .catch(err => {
                    console.log(err);
                    db.rollback();
                    return false;
                });

    }/// end delete 

    view(){
        /// view to specific procedure...
        procSpecClinic.fKeysSelect(this.proc_id,this.spec_id,this.clinic_id)
            .then(result => {
                if (result.status != 1){
                    throw result.data;
                }
                return result.data ;
            })

    }/// end view() 

    static viewAccordClinic(clinic_id){

        this.table = "proc_spec_clinic";
        var query = `SELECT p.* FROM health_tourism.${this.table} AS p 
                    INNER JOIN health_tourism.specializations_clinics AS s 
                    ON p.spec_clinic_id = s.specializations_clinics_id 
                    WHERE s.clinic_id = ${clinic_id};`

        return db.execute(query)
            .then(result => {
                return result[0]
            })
            .catch(err=>{
                throw err
            })
        
    }/// end viewAccordClinic()


    checkForUpdatedColumns(prev_values,values){

        values[1] = prev_values.spec_clinic_id
        if(!this.min_price ){
            values[2] = prev_values.min_price 
        }else{
            values[2] = this.min_price
        }
        if(!this.max_price){
            values[3] = prev_values.max_price 
        }else{
            values[3] = this.max_price
        }
        if(!this.duration){
            values[4] = prev_values.duration 
        }else{
            values[4] = this.duration
        }
        if(!this.num_visits){
            values[5] = prev_values.num_visits 
        }else{
            values[5] = this.num_visits
        }
        if(!this.bookable){
            values[6] = prev_values.bookable 
        }else{
            values[6] = this.bookable
        }
        if(!this.description){
            values[7] = prev_values.description 
        }else{
            values[7] = this.description
        }
        if(!this.img1){
            values[8] = prev_values.img1 
        }else{
            values[8] = this.img1
        }
        if(!this.img2){
            values[9] = prev_values.img2 
        }else{
            values[9] = this.img2
        }

    }/// end checkForUpdatedColumns()

    initValues(values){
        for (let index = 0; index < values.length; index++) {
            if(values[index] == undefined){
                values[index] = null;
            }
        }
    }/// end initValues()


};
/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @end
 * 
 */