const db = require('../utilites/db');

exports.getAllCurrencies = () => {

    return db.execute(`select * from currency ;`);

};

// values = {currencies: array of currency, currencyId, clinicId or travelAgencyId}
exports.addCurrency = (values) => {

    const data = [];

    if (values.clinicId) {
        values.travelAgencyId = null;
    } else {
        values.clincinId = null;
    }

    return new Promise((resolve, reject) => {

        values.currencies.forEach(currency => {
            db.execute(`insert into clinic_currency_travel_agency (currency_id, clinics_id, travel_agency_id) values (?, ?, ?)`, [currency.id, values.clinicId, values.travelAgencyId])
                .then(result => {
                    data.push({ id: result[0].insertId });
                    if (data.length === values.currencies.length) {
                        resolve({ success: true, message: 'Adding currency successfully.', status: 200 , data: data})
                    }
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


exports.getAllCurrenciesById = (clinicId, travelAgencyId) => {
    console.log(clinicId);
    if (clinicId) {
        return db.execute(
            `select currency.name, currency.code from currency left join
             clinic_currency_travel_agency on currency.id=clinic_currency_travel_agency.currency_id
             left join clinics on clinic_currency_travel_agency.clinics_id=clinics.id where clinics.id=?`,
            [clinicId]
        );
    } else {
        return db.execute(
            `select currency.name, currency.code from currency left join
             clinic_currency_travel_agency on currency.id=clinic_currency_travel_agency.currency_id
             left join travel_agency on clinic_currency_travel_agency.travel_agency_id=travel_agency.id where travel_agency.id=?`,
            [travelAgencyId]
        );
    }

};
