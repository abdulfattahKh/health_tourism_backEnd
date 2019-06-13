const db = require("../utilites/db");



module.exports = class Trips {
    constructor(trip){
        this.startFrom      = trip.body.startFrom;
        this.finishTo       = trip.body.finishTo;
        this.name           = trip.body.name;
        this.tripFlow       = trip.body.tripFlow;
        this.description    = trip.body.description;
        this.price          = trip.body.price;
        this.evaluation     = trip.body.evaluation;
        this.TravelAgencyId = trip.body.TravelAgencyId;
    }

    save(){
        return db.execute(`insert into trips(
        start_from,
        finish_to,
        name,
        trip_flow,
        description,
        price,
        evaluation,
        travel_agency_id
        ) values (?,?,?,?,?,?,?,?)`,
            [
                this.startFrom,
                this.finishTo,
                this.name,
                this.tripFlow,
                this.description,
                this.price ,
                this.evaluation,
                this.TravelAgencyId
            ]
        );
    }
    //'1995-12-17T03:24:00'

    static delete(id){
        return db.execute('delete from trips where id = ?',[id]);
    }

    static getAll(){
        return db.execute('select * from trips');
    }

    static getById(id){
        return db.execute('select * from trips where id = ?',[id]);
    }

    update(id){
        return db.execute(`update trips set
        start_from = ?,
        finish_to = ?,
        name = ?,
        trip_flow = ?,
        description = ?,
        price = ?,
        evaluation = ?,
        travel_agency_id = ?
        where id = ?
        `,
            [
                this.startFrom,
                this.finishTo,
                this.name,
                this.tripFlow,
                this.description,
                this.price ,
                this.evaluation,
                this.TravelAgencyId,
                id
            ]
        );
    }
    //'1995-12-17T03:24:00'

}