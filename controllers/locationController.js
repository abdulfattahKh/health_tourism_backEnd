const locationModel = require('../models/locationModel');

// tested
exports.getAllCountries = (req, res, next) => {
    locationModel.getAllCountries()
        .then(result => {
            console.log(result);
            if (!result) {
                return res.json({
                    status: 404,
                    data: 'Data Not found'
                });
            }
            res.json({
                status: 200,
                data: result[0]
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                data: 'Internal error server'
            })
        })
};


// tested
exports.getAllCitiesByCountryId = (req, res, next) => {
    const countryId = req.query.countryId;
    console.log('omar' + countryId);
    locationModel.getAllCitiesByCountryId(countryId)
        .then(result => {
            if (!result) {
                return res.json({
                    status: 404,
                    data: 'Data Not found'
                });
            }
            res.json({
                status: 200,
                data: result[0]
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                data: 'Internal error server'
            });
        });
};

// tested
exports.getAllStatesByCityId = (req, res, next) => {
    const countryId = req.query.countryId;
    const cityId = req.query.cityId;
    console.log(countryId, cityId);
    locationModel.getAllStatesByCityId(countryId, cityId)
        .then(result => {
            if (!result) {
                return res.json({
                    status: 404,
                    data: 'Data Not found'
                });
            }
            res.json({
                status: 200,
                data: result[0]
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: 500,
                data: 'Internal error server'
            });
        });
};
