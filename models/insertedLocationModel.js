const db = require("../utilites/db");


module.exports = class insertLocation {
    constructor(location) {
        this.city = location.city;
        this.country = location.country;
        this.state = location.state;
        this.id = location.id;
        this.type = location.type;
    }

    save() {
        return db.execute(`
        INSERT INTO locations
        VALUES(?,?,?,?,?)`
            , [
                this.country,
                this.city,
                this.state,
                this.id,
                this.type
            ]);
    }


    static delete(id) {
        return db.execute(`DELETE FROM locations WHERE clinics_id = ? and type = 1`, [id]);
    }

    
    update() {
        return db.execute(
            `UPDATE locations
            SET
            country_id = ?,
            city_id = ?,
            state_id = ?,
            type = ?
            WHERE clinics_id = ?`
            , [
                this.country,
                this.city,
                this.state,
                this.type,
                this.id
                
            ]);
    }

}

