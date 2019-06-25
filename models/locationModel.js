const db = require("../utilites/db");

exports.addCountry = name => {
  return db.execute(`INSERT INTO countries(name) values(?)`, [name]);
};

exports.getAllCountries = () => {
  return db.execute(
    `select country_id, country_name, country_code from countries;`
  );
};

exports.getAllCitiesByCountryId = countryId => {
  return db.execute(
    `select city_id, city_name, city_code from cities join countries on cities.country_id = countries.country_id where cities.country_id = ? `,
    [countryId]
  );
};

exports.getAllStatesByCityId = (countryId, cityId) => {
  return db.execute(
    `select state_id, state_name from countries 
    inner join cities on countries.country_id=cities.country_id 
    inner join states on cities.city_id=states.cities_city_id where cities.country_id=? and states.cities_city_id=?`,
    [countryId, cityId]
  );
};

exports.getCountry = (tabelName, id) => {
  return db.execute(
    `select countries.country_id, countries.country_name from ${tabelName} left join
     locations on ${tabelName}.location_id=locations.location_id left join
     countries on locations.country_id=countries.country_id where ${tabelName}.id=?`,
    [id]
  );
}

exports.getCity = (tabelName, id) => {
  return db.execute(
    `select cities.city_id, cities.city_name from ${tabelName} left join
     locations on ${tabelName}.location_id=locations.location_id left join
     cities on locations.city_id=cities.city_id where ${tabelName}.id=?`,
    [id]
  );
}

exports.getState = (tabelName, id) => {
  return db.execute(
    `select states.state_id, states.state_name from ${tabelName} left join
     locations on ${tabelName}.location_id=locations.location_id left join
     states on locations.state_id=states.state_id where ${tabelName}.id=?`,
    [id]
  );
}