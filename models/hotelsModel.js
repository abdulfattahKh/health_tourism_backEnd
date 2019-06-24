const db = require("../utilites/db");
module.exports = class hotel {
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
        insert into hotels(address, description, email, evaluation, mobile_number, name, price)
        values(?,?,?,?,?,?,?)
        `, [this.address, this.description, this.email, this.evaluation, this.mobile_number, this.name, this.price])
    }

    static addTripHotel(tripId, hotelId) {
        return db.execute(`
        insert into trips_hotels(trip_id , hotel_id) values(?,?)
        `, [tripId, hotelId]);
    }
}