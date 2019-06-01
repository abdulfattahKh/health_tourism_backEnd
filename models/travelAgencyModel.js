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
            this.status = Travel.status
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
         values(?,?,?,?,?)`
            , [
                this.name,
                this.address,
                this.map,
                this.userId,
                this.LocationId
            ]);
    }


    update() {
        return db.execute(
            `UPDATE travel_agency
        SET
        name = ? ,
        address = ? ,
        map =? ,
        users_Id =? ,
        status = ? ,
        location_id = ?
        WHERE id = ?`
            , [
                this.name,
                this.address,
                this.map,
                this.userId,
                this.status,
                this.locationId,
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
        return db.execute(`SELECT t.name, t.address,t.map ,t.users_id ,l.country_id ,l.state_id ,l.city_id 
        FROM travel_agency t inner join locations l
        on t.location_id = l.location_id`);
    }

    static getAllTravleByStatus(stat) {
        return db.execute(`select * from travel_agency where status = ?`, [stat]);
    }

    static getAllTravleById(id) {
        return db.execute(`SELECT t.name, t.address,t.map ,t.users_id ,l.country_id ,l.state_id ,l.city_id 
                           FROM travel_agency t inner join locations l
                           on t.location_id = l.location_id
                           where id = ?`, [id]);
    }


    static transactionInsert(res, travel) {
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
                                     state_id    = ${travel.state}`
                , []
                , function (err, rows) {
                    if (rows.length != 0) { ///// location already exist

                        travel.locationId = rows[0].location_id;
                        connection.query(`insert into travel_agency (name,address,map,users_id,location_id)
                                                                            values(?,?,?,?,?)`
                            , [
                                travel.name,
                                travel.address,
                                travel.map,
                                travel.userId,
                                travel.locationId
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

                    }
                    else {
                        // location not fuond and i should insert this location
                        connection.query(`INSERT INTO locations (country_id,city_id,state_id)
                            VALUES(?,?,?)`
                            , [
                                travel.country,
                                travel.city,
                                travel.state
                            ], function (error, results, fields) {
                                if (error) return res.json({
                                    success: false,
                                    message: err.message
                                });


                                connection.query(`insert into travel_agency 
                                                (name,address,map,users_id,location_id)
                                                values(?,?,?,?,?)`
                                    , [
                                        travel.name,
                                        travel.address,
                                        travel.map,
                                        travel.userId,
                                        results.insertId
                                    ], function (error, resu, fields) {
                                        if (error) return res.json({
                                            success: false,
                                            message: err.message
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

                                    }/////////////////////////////////////
                                )

                            }
                        )
                    }

                }


            )


        });//begin transaction

    }//transaction method 
}




