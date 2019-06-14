const db = require('../utilites/db');

// values = {currencies: array of currency, currencyId, clinicId, travelAgencyId}
exports.addCurrency = (values) => {

    return new Promise((resolve, reject) => {

        values.currencies.forEach(currency => {
            db.execute(`
            insert into clinic_currency_travel_agency (currency_id, clinics_id, travel_agency_id) 
            values (?, ?, ?)`, 
            [currency.id, values.clinicId, values.travelAgencyId])
                .then(result => {
                    resolve({ success: true, message: 'Adding currency successfully.', status: 200 })
                })
                .catch(err => {
                    reject({ success: false, status: 500, message: 'Adding currency failed!', err: err });
                })
        });

    });

};

// values = {currencyId, clinicId, travelAgencyId } // 
exports.deleteCurrency = (id) => {
    return db.execute(
        `delete from clinic_currency_travel_agency where clinic_currency_travel_agency_id=?`,
        [id]
    );
};

// values = { newCurrencyId, id}
exports.updateCurrency = (id, newCurrencyId) => {

    return db.execute(
        `update clinic_currency_travel_agency set currency_id=? where clinic_currency_travel_agency_id=?`,
        [newCurrencyId, id]
    );
};


