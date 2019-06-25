const db = require("../utilites/db");



module.exports = class Trips {
    constructor(trip) {

        this.startFrom = trip.startFrom;
        this.finishTo = trip.finishTo;
        this.name = trip.name;
        this.tripFlow = trip.tripFlow;
        this.description = trip.description;
        this.price = trip.price;
        this.evaluation = trip.evaluation;
        this.TravelAgencyId = trip.TravelAgencyId;
    }

    save() {
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
                this.price,
                this.evaluation,
                this.TravelAgencyId
            ]
        );
    }
    //'1995-12-17T03:24:00'

    static delete(id) {
        return db.execute('delete from trips where id = ?', [id]);
    }

    static getAll() {
        return db.execute('select * from trips');
    }

    static getById(id) {
        return db.execute('select * from trips where id = ?', [id]);
    }

    static getTripsByUserId(TravelAgencyId) {
        return db.execute(`
        select 
        ta.name as travelAgency,
        u.mobile_number,
        concat(u.first_name , u.last_name) as userName,
        tp.start_from ,
        tp.finish_to as finishAt,
        tp.name as tripName,
        tp.id
        from trips tp  
        inner join travel_agency ta on tp.travel_agency_id = ta.id
        inner join users u on u.id = ta.users_id
        where ta.id = ?
        order by start_from;
        `, [TravelAgencyId])
    }

    update(id) {
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
                this.price,
                this.evaluation,
                this.TravelAgencyId,
                id
            ]
        );
    }
    //'1995-12-17T03:24:00'

}