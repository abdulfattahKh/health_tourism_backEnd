const db = require('../utilites/db');

exports.getAllCountries = () => {
    return db.execute(`select country_id, country_name, country_code from countries;`)
};


exports.getAllCitiesByCountryId = (countryId) => {
    return db.execute(`select city_id, city_name, city_code from cities join countries on cities.country_id = countries.country_id where cities.country_id = ? `, [countryId]);
};


exports.getAllStatesByCityId = (countryId, cityId) => {
    return db.execute(`select state_id, state_name from countries 
    inner join cities on countries.country_id=cities.country_id 
    inner join states on cities.city_id=states.cities_city_id where cities.country_id=? and states.cities_city_id=?`, [countryId, cityId]);
};