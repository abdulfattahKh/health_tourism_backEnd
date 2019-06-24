const db = require("../utilites/db");


module.exports = class Review {
    constructor(values, userId) {
        this.clinicId = values.clinicId ? values.clinicId : null;
        this.travelAgencyId = values.travelAgencyId ? values.travelAgencyId : null;
        this.general = values.general ? values.general : 0;
        this.userId = userId;
        this.header = values.header;
        this.content = values.content;
        this.stars = values.stars;
        this.createdAt = values.createdAt;
    }

    save() {
        const sql =
            `INSERT INTO reviews(clinics_id,users_id,travel_agency_id,content,header,general,stars,created_at)
        VALUES(?,?,?,?,?,?,?,?)`;

        return db.execute(sql,
            [
                this.clinicId,
                this.userId,
                this.travelAgencyId,
                this.content,
                this.header,
                this.general,
                this.stars,
                this.createdAt
            ])
    }

    toString() {
        return `clinicId is ${this.clinicId} & travelAgencyId is ${this.travelAgencyId} & general is ${this.general}`
    }

    static delete(id) {
        return db.execute(`delete from reviews where id = ${id}`);
    }

    static getAllReviews() {
        return db.execute(`
            select r.* , CONCAT(u.first_name , ' ' , u.last_name) as userName 
            from reviews r inner join users u
            on r.users_id = u.id
            `
        )
    }
    static getGeneralReviews() {
        return db.execute(`
                select r.* , CONCAT(u.first_name , ' ' , u.last_name) as userName 
                from reviews r inner join users u
                on r.users_id = u.id
                where r.general = 1
                `
        )
    }

    static getClinicReviews(clinicId) {
        return db.execute(`
                select r.* , CONCAT(u.first_name , ' ' , u.last_name) as userName 
                from reviews r inner join users u
                on r.users_id = u.id
                where r.clinics_id = ${clinicId}
                `
        )
    }

    static getTravelAgencyReviews(id) {
        return db.execute(`
                select r.* , CONCAT(u.first_name , ' ' , u.last_name) as userName 
                from reviews r inner join users u
                on r.users_id = u.id
                where r.travel_agency_id = ${id}
                `
        )
    }

    update(id){
        return db.execute(
        `UPDATE reviews SET
            clinics_id          = ?,
            users_id            = ?,
            travel_agency_id    = ?,
            content             = ?,
            header              = ?,
            general             = ?,
            stars               = ?,
            created_at          = ?
        WHERE id                = ?`
        ,[
            this.clinicId,
            this.userId,
            this.travelAgencyId,
            this.content,
            this.header,
            this.general,
            this.stars,
            this.createdAt,
            id
        ])
    }
}


