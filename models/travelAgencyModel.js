const db = require("../utilites/db");
const inseredLocationModel = require('../models/insertedLocationModel');
const connection = require("../utilites/db2");

module.exports = class TravelAgency {
    constructor(Travel) {
        this.name = Travel.name,
            this.address = Travel.address,
            this.country = Travel.country,
            this.city = Travel.city,
            this.state = Travel.state,
            this.map = Travel.map,
            this.userId = Travel.userId,
            this.status = Travel.status,
            this.description = Travel.description
    }

    setId(id) {
        this.id = id;
    }

    setLocationId(id) {
        this.LocationId = id;
    }

    setStatus(stat) {
        this.status = stat;
    }

    save() {
        return db.execute(`insert into travel_agency (name,address,map,users_id,location_id)
         values(?,?,?,?,?)`, [
            this.name,
            this.address,
            this.map,
            this.userId,
            this.LocationId
        ]);
    }


    update() {
        console.log(this.address);
        return db.execute(
            `UPDATE travel_agency
        SET
        name = ? ,
        address = ? ,
        map =? ,
        users_Id =? ,
        status = ? ,
        location_id = ?,
        description = ?
        WHERE id = ?`, [
                this.name,
                this.address,
                this.map,
                this.userId,
                this.status,
                this.locationId,
                this.description,
                this.id
            ]);
    }

    static delete(id) {
        return db.execute(`DELETE FROM travel_agency WHERE id = ?`, [id]);
    }

    static changeStatus(id) {
        return db.execute(`UPDATE travel_agency SET status = ? WHERE id = ?`,
            [
                'accepted',
                id
            ]);

    }

    static getAllTravle() {
        return db.execute(`SELECT t.id ,t.name, t.address,t.map ,t.users_id ,l.country_id ,l.state_id ,l.city_id 
        ,l.longitude , l.latitude ,t.status ,
        CONCAT(u.first_name ,' ', u.last_name) as 'userName',
        t.description
        FROM travel_agency t inner join locations l
        on t.location_id = l.location_id inner join users u
        on t.users_id = u.id`);
    }

    static getAllTravleByStatus(stat) {
        return db.execute(`SELECT t.name, t.address,t.map ,t.users_id ,l.country_id ,l.state_id ,l.city_id 
                          ,l.longitude , l.latitude ,t.status ,
                          CONCAT(u.first_name ,' ', u.last_name) as 'userName',
                          t.description
                          FROM travel_agency t inner join locations l
                          on t.location_id = l.location_id inner join users u
                          on t.users_id = u.id 
                          where status = ?`, [stat]);
    }

    static getAllTravleById(id) {
        return db.execute(`
                        SELECT t.id ,t.name, t.address,t.map ,t.users_id ,l.country_id ,l.state_id ,l.city_id ,
                        l.longitude , l.latitude ,t.status ,
                        CONCAT(u.first_name ,' ', u.last_name) as 'userName',
                        t.description
                        FROM travel_agency t inner join locations l
                        on t.location_id = l.location_id inner join users u
                        on t.users_id = u.id
                        where t.id = ?`,
            [id]);
    }


    static transactionInsert(res, travel) {
        console.log(travel)
        connection.beginTransaction(function (err) {
            if (err) {
                return res.json({
                    success: false,
                    message: err.message
                });
            }

            connection.query(`SELECT location_id
                              FROM   locations
                              where  country_id  = ${travel.country} and
                                     city_id     = ${travel.city} and
                                     state_id    = ${travel.state}`, [], function (err, rows) {
                    if (rows.length != 0) { ///// location already exist

                        travel.locationId = rows[0].location_id;
                        connection.query(`insert into travel_agency (name,address,map,users_id,location_id,description)
                                                                            values(?,?,?,?,?,?)`, [
                                travel.name,
                                travel.address,
                                travel.map,
                                travel.userId,
                                travel.locationId,
                                travel.description
                            ],
                            function (error, results, fields) {
                                if (error) {
                                    return connection.rollback(function () {
                                        return res.json({
                                            success: false,
                                            message: error.message
                                        });
                                    });
                                }

                                connection.commit(function (err) {
                                    if (err) {
                                        return connection.rollback(function () {
                                            return res.json({
                                                success: false,
                                                message: err.message
                                            });
                                        });
                                    }
                                    return res.json({
                                        success: true,
                                        message: "travel agency was added correctly"
                                    });
                                });

                            });

                    } else {
                        // location not fuond and i should insert this location
                        connection.query(`INSERT INTO locations (country_id,city_id,state_id,latitude,longitude)
                            VALUES(?,?,?,?,?)`, [
                            travel.country,
                            travel.city,
                            travel.state,
                            travel.latitude,
                            travel.longitude
                        ], function (error, results, fields) {
                            if (error) return res.json({
                                success: false,
                                message: error.message
                            });


                            connection.query(`insert into travel_agency 
                                                (name,address,map,users_id,location_id,description)
                                                values(?,?,?,?,?,?)`, [
                                    travel.name,
                                    travel.address,
                                    travel.map,
                                    travel.userId,
                                    results.insertId,
                                    travel.description
                                ], function (error, resu, fields) {
                                    if (error) return res.json({
                                        success: false,
                                        message: error.message
                                    });
                                    connection.commit(function (err) {
                                        if (err) {
                                            return connection.rollback(function () {
                                                return res.json({
                                                    success: false,
                                                    message: err.message
                                                });
                                            });
                                        }
                                        return res.json({
                                            success: true,
                                            message: "travel agency was added correctly"
                                        });
                                    });

                                } /////////////////////////////////////
                            )

                        })
                    }

                }


            )


        }); //begin transaction

    } //transaction method 

    static getTravelAgencyById(travelId) {
        return db.execute(
            `select 
            c.id,
            l.latitude,
            l.longitude,
            c.name as 'name',
            c.description,
            c.status,
            co.country_name as 'country',
            ci.city_name as 'city',
            st.state_name as 'state',
            us.id as 'userId',
            us.first_name as 'fOwnerName',
            us.last_name as 'lOwnerName',
            us.email,
            us.mobile_number as 'mobileNumber'

            from travel_agency c 
            inner join locations l on c.location_id = l.location_id
            inner join countries co on l.country_id = co.country_id
            inner join cities ci on ci.city_id = l.city_id
            inner join states st on st.state_id = l.state_id
            inner join users us on us.id = c.users_id`
        )
        /*we should add  those */
        /*  c.phone_number as 'phoneNumber',
            c.mobile_number as 'mobileNumber'*/
    }

    static getMyTravelAgencies(userId) {
        return db.execute(`
                        SELECT t.id ,t.name, t.address,t.map ,t.users_id ,l.country_id ,l.state_id ,l.city_id ,
                        l.longitude , l.latitude ,t.status ,
                        CONCAT(u.first_name ,' ', u.last_name) as 'userName',
                        t.description
                        FROM travel_agency t inner join locations l
                        on t.location_id = l.location_id inner join users u
                        on t.users_id = u.id
                        where t.users_id = ?`,
            [userId]);
    }

    static getLastTravelAgencyAdded () {
        return db.execute(`select * from travel_agency order by id desc limit 1`);
    }


    static getTravelAgencyInfo (travelAgencyId) {

        return db.execute(
            `select
            t.id as travelAgencyId,
            t.name,
            t.address,
            t.map,
            t.status,
            u.id as userId,
            u.first_name as fOwnerName,
            u.last_name as lOwnerName,
            u.email,
            u.mobile_number as userMobileNumber,
            l.longitude,
            l.latitude,
            co.country_name as country,
            ci.city_name as city,
            st.state_name as state
            from travel_agency t
            inner join users u on t.users_id=u.id
            inner join locations l on t.location_id=l.location_id
            inner join countries co on l.country_id=co.country_id
            inner join cities ci on l.city_id=ci.city_id
            inner join states st on l.state_id=st.state_id
            where t.id=?`,
            [travelAgencyId]
        );

    }
}