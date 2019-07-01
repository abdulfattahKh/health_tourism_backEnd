/****
 * 
 * 
 * @author Abdulrahman Al hussein 
 * @start
 * 
 */

 const db = require("../utilites/db");
const fs = require("fs")

module.exports = class Procedure {
    constructor(values) {
        this.id = values.id;
        this.name = values.name;
        this.specializations_spec_id = values.spec_id;
        this.table = "procedures"
    }

    static viewAccordSpecId(spec_id){
        this.table = "procedures"
        var query = `SELECT * FROM ${this.table} WHERE specializations_spec_id = ${spec_id};`

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
    }///end viewAccordSpecId()


    static viewAccordAutoComplate(sub_word){
        sub_word = sub_word + "%";
        var query = `SELECT * FROM procedures 
                WHERE lower(name) LIKE lower("${sub_word}") limit 10;`
        return db.execute(query)
                    .then(result=>{
                        console.log(result);
                        if( !result[0].length ){
                            return false
                        }
                        return result[0]
                    }).catch(err=>{
                        throw err 
                    })
    }


    static insertProceduresIntoDB(){
        var file_path = "./treatments.json";
        // name  
        // specializations_spec_id

        fs.readFile(file_path , "utf8" , (err , data) => {
            if( err ){
                throw err
            }
            var obj = JSON.parse( data )

            
            var query = `INSERT INTO procedures 
                        ( name, specializations_spec_id) VALUES (?,?);`
            for (let i = 0; i < obj.treatments.length ; i++) {
                console.log("Spec_id " + (i+1) + ">>>>>>>");
                
                for (let j = 0; j < obj.treatments[i].procedures.length; j++) {
                    
                    db.execute(query,[obj.treatments[i].procedures[j],i+1])
                        .then(result=>{
                        }).catch(err=>{
                            throw err;
                        })
                }
            }
                    
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