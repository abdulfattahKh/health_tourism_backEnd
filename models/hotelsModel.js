const db = require("../utilites/db");
exports = class hotel {
    constructor(values) {

        this.address = values.address;
        this.description = values.description;
        this.email = values.email;
        this.evaluation = values.evaluation;
        this.mobile_number = values.mobile_number;
        this.name = values.name;
        this.price = values.price;
        
    };
    save() {
        return db.execute(`
        insert into hotles(address, description, email, evaluation, mobile_number, name, price)
        values(?,?,?,?,?,?,?)
        `, [this.address, this.description, this.email, this.evaluation, this.mobile_number, this.name, this.price])
    }
}