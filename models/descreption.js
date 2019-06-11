const db = require('../utilites/db');


exports.addDescreption = (tableName, descreption, clinicId, travelAgencyId) => {
    const id = (tableName === 'clinics' ? clinicId : travelAgencyId);
    return db.execute(`update ${tableName} set descreption=? where id=?`, [descreption, id]);
};
