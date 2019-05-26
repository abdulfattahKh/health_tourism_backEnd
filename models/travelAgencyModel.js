const db = require("../utilites/db");

module.exports = class TravelAgency {
    constructor(Travel) {
        this.name = Travel.name,
            this.address = Travel.address,
            this.country = Travel.country,
            this.city = Travel.city,
            this.state = Travel.state,
            this.map = Travel.map,
            this.userId = Travel.userId
    }

    setId(id) {
        this.id = id;
    }

    setStatus(stat) {
        this.status = stat;
    }

    save() {
        return db.execute(`insert into travel_agency (name,address,country,city,state,map,users_id)
         values(?,?,?,?,?,?,?)`
            , [
                this.name,
                this.address,
                this.country,
                this.city,
                this.state,
                this.map,
                this.userId

            ]);
    }


    update() {
        return db.execute(
            `UPDATE travel_agency
        SET
        name = ? ,
        address = ? ,
        country =? ,
        city = ? ,
        state =? ,
        map =? ,
        users_Id =? ,
        status = ?
        WHERE id = ?`
            , [
                this.name,
                this.address,
                this.country,
                this.city,
                this.state,
                this.map,
                this.userId,
                this.status,
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
        return db.execute(`select * from travel_agency`);
    }

    static getAllTravleByStatus(stat) {
        return db.execute(`select * from travel_agency where status = ?`,[stat]);
    }
}

