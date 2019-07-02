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
        this.locationId = trip.locationId;
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
        travel_agency_id,
        location_id
        ) values (?,?,?,?,?,?,?,?,?)`,
            [
                this.startFrom,
                this.finishTo,
                this.name,
                this.tripFlow,
                this.description,
                this.price,
                this.evaluation,
                this.TravelAgencyId,
                this.locationId
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

    static getPopularDestinations() {
        return db.execute(
            `select count(*) as 'number' , 
                        locations.location_id ,
                        countries.country_name , 
                        cities.city_name , 
                        states.state_name from trips 
                        inner join locations on trips.location_id = locations.location_id
                        inner join cities on locations.city_id = cities.city_id
                        inner join countries on countries.country_id  = locations.country_id
                        inner join states on states.state_id = locations.state_id
                        group by locations.location_id
                        order by 'number'
                        limit 4
                        `
        )
    }


    static search(country_id, city_id, state_id) {


        return db.execute(`
            select 
            trips.id as tripId,
            trips.start_from as startFrom ,
            trips.finish_to as finishAt ,
            trips.name as tripName,
            trips.trip_flow as flow,
            trips.description as tripDescription,
            countries.country_name as country,
            cities.city_name as city,
            states.state_name as state,
            travel_agency.name as travelAgencyName,
            travel_agency.address as travelAgencyAddress,
            images.image_name,
            (select count(*) from reviews where reviews.travel_agency_id = travel_agency.id) as numberOfReviews,
            (select avg(stars) from reviews where reviews.travel_agency_id = travel_agency.id) as reviewsAverage

            from trips 
            inner join locations on trips.location_id  = locations.location_id
            inner join countries on countries.country_id = locations.country_id
            inner join cities on cities.city_id = locations.city_id
            inner join states on states.state_id = locations.state_id
            inner join travel_agency on trips.travel_agency_id = travel_agency.id
            left join images on images.trips_id = trips.id
            where locations.country_id = ? and locations.city_id = ? and locations.state_id = ? 
        `, [country_id, city_id, state_id])






        console.log(country_id + " " + city_id + " " + state_id);

        let query = 'SELECT * FROM locations WHERE country_id = ' + country_id +
            ' AND city_id = ' + city_id + ' AND state_id = ' + state_id

        return db.execute(query)
            .then(result => {
                console.log(result);
                var arrivalPoint = result[0][0];
                query = `SELECT  
                trp.start_from , trp.finish_to , trp.name , trp.trip_flow , trp.description ,trp.price ,
                trp.evaluation  ,
                tr.name , tr.address ,tr.map , tr.status , cn.country_name , cn.country_code, ct.city_name , ct.city_code ,st.state_name , st.state_code , st.statescol,
                loc.longitude , loc.latitude
                FROM trips as trp INNER JOIN travel_agency as tr
                ON trp.travel_agency_id = tr.id
                INNER JOIN  locations as loc 
                ON tr.location_id = loc.location_id
                INNER JOIN countries as cn 
                ON loc.country_id = cn.country_id
                INNER JOIN cities as ct 
                ON ct.city_id = loc.city_id 
                INNER JOIN states as st 
                ON st.state_id = loc.state_id
                INNER JOIN users as usr 
                ON tr.users_id = usr.id
                INNER JOIN roles as rl  
                ON rl.role_id = usr.role_id
                WHERE  trp.arrival_point_id = ${arrivalPoint.location_id} `

                return db.execute(query)
                    .then(result => {
                        query = `SELECT cn.country_name , cn.country_code, ct.city_name , ct.city_code ,st.state_name ,
                                st.state_code , st.statescol, loc.longitude , loc.latitude 
                                FROM countries as cn INNER JOIN cities as ct 
                                ON cn.country_id = ct.country_id 
                                INNER JOIN states as st 
                                ON st.cities_city_id = ct.city_id 
                                INNER JOIN locations as loc 
                                ON ( loc.country_id = ${country_id} 
                                    AND loc.city_id = ${city_id} 
                                    AND loc.state_id = ${state_id} )`

                        var trip = result[0][0]
                        return db.execute(query)
                            .then(result => {
                                var rtn_obj = {
                                    "arrivalPoint_longitude": arrivalPoint.longitude,
                                    "arrivalPoint_latitude": arrivalPoint.latitude,
                                    "arrivalPoint_statescol": arrivalPoint.statescol,
                                    "arrivalPoint_state_code": arrivalPoint.state_code,
                                    "arrivalPoint_state_name": arrivalPoint.state_name,
                                    "arrivalPoint_city_code": arrivalPoint.city_code,
                                    "arrivalPoint_city_name": arrivalPoint.city_name,
                                    "arrivalPoint_country_code": arrivalPoint.country_code,
                                    "arrivalPoint_country_name": arrivalPoint.country_name,
                                    "start_from": trip.start_from,
                                    "finish_to": trip.finish_to,
                                    "name": trip.name,
                                    "trip_flow": trip.trip_flow,
                                    "description": trip.description,
                                    "price": trip.price,
                                    "evaluation": trip.evaluation,
                                    "address": trip.address,
                                    "map": trip.map,
                                    "status": trip.status,
                                    "travel_country_name": trip.country_name,
                                    "travel_country_code": trip.country_code,
                                    "travel_city_name": trip.city_name,
                                    "travel_city_code": trip.city_code,
                                    "travel_state_name": trip.state_name,
                                    "travel_state_code": trip.state_code,
                                    "travel_statescol": trip.statescol,
                                    "travel_longitude": trip.longitude,
                                    "travel_latitude": trip.latitude
                                }
                                return rtn_obj
                            })
                    })
            })
    }



    /* test sample */

    // const tripModel = require("./models/tripsModel")
    // tripModel.getTripByArraivalPoint({
    //     "country_id": 201,
    //     "city_id": 1,
    //     "state_id": 9
    // }).then(result => {
    //     console.log(result);

    // })


    //'1995-12-17T03:24:00'

}