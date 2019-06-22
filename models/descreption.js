const db = require('../utilites/db');


exports.addDescreption = (tableName, descreption, clinicId, travelAgencyId) => {
    const id = (tableName === 'clinics' ? clinicId : travelAgencyId);
    return db.execute(`update ${tableName} set description=? where id=?`, [descreption, id]);
};


exports.getDescreption = (tableName, id) => {

    return db.execute(`select description from ${tableName} where id=?`, [id])

};