const db = require('../utilites/db');


exports.addDescreption = (tableName, description, clinicId, travelAgencyId) => {
    const id = (tableName === 'clinics' ? clinicId : travelAgencyId);
    return db.execute(`update ${tableName} set description=? where id=?`, [description, id]);
};


exports.getDescreption = (tableName, id) => {

    return db.execute(`select description from ${tableName} where id=?`, [id])

};