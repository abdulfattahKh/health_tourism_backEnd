const travelModel = require('../models/travelAgencyModel')
const insertLocationModel = require('../models/insertedLocationModel')
const connection = require('../utilites/db2')

// work
module.exports.addTravel = (req, res, next) => {
  const travel = {
    name: req.body.name,
    address: req.body.address,
    country: req.body.country,
    city: req.body.city,
    state: req.body.state,
    map: req.body.map,
    userId: req.params.userId
  }


  travelModel.transactionInsert(res,travel);
    
}


//not work for testing only
module.exports.addTravel1 = (req, res, next) => {
  const travel = {
    name: req.body.name,
    address: req.body.address,
    country: req.body.country,
    city: req.body.city,
    state: req.body.state,
    map: req.body.map,
    userId: req.params.userId
  }

  const travekObject = new travelModel(travel);
  travekObject.save()
    .then(save_res => {

      const insertedId = save_res[0].insertId;
      const insertLocation = {
        country: travel.country,
        city: travel.city,
        state: travel.state,
        id: insertedId,
        type: 1
      }

      locationModel = new insertLocationModel(insertLocation);
      return locationModel.save();
    })
    .then(save_res => {
      if (save_res[0].affectedRows) {
        return res.json({
          success: true,
          message: "travel agency was added correctly"
        });
      }
      return res.json({
        success: false,
        message: "try again"
      });
    })
    .catch(err => {
      res.status(504).json({
        success: false,
        message: "try again",
        err: err.message
      });
    });

}

//not work old version not supported   :)  hhhhh  
module.exports.updateTravel1 = (req, res, next) => {
  const travel = {
    name: req.body.name,
    address: req.body.address,
    country: req.body.country,
    city: req.body.city,
    state: req.body.state,
    map: req.body.map,
    status :req.body.status,
    userId: req.body.userId
  }

  console.log(travel)
  const travekObject = new travelModel(travel);
  console.log(travekObject)
  travekObject.setId(req.params.id);
  const location = {
    country: travel.country,
    city: travel.city,
    state: travel.state,
    id: travekObject.id
  }
  
  const locationModelObject = new insertLocationModel(location);
  travekObject.update()
    .then(save_res => {
      console.log('ayeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeedSSSSSSSs')
      return locationModelObject.update();
    })
    .then(save_res => {
      if (save_res[0].affectedRows) {
        return res.json({
          success: true,
          message: "travel agency was updated correctly"
        });
      }
      return res.json({
        success: false,
        message: "try again"
      });
    })
    .catch(err => {
      res.status(504).json({
        success: false,
        message: "try again",
        err: err.message
      });
    });


}

// work
module.exports.updateTravel = (req, res, next) => {
  const travel = {
    name: req.body.name,
    address: req.body.address,
    country: req.body.country,
    city: req.body.city,
    state: req.body.state,
    map: req.body.map,
    status :req.body.status,
    userId: req.body.userId,
    id :req.params.id
  }

  let sql = `select * 
             from locations
             where country_id = ? and
                   city_id 	  = ? and
                   state_id   = ?`
  connection.query(sql,[travel.country,travel.city,travel.state],function (err, rows) {
      if(rows.length){// location already exist
        console.log(rows[0].location_id)
        let sql = `UPDATE travel_agency
                  SET
                  name = ? ,
                  address = ? ,
                  map =? ,
                  users_Id =? ,
                  status = ? ,
                  location_id = ?
                  WHERE id = ?`
                  connection.query(sql,
                    [ travel.name,
                      travel.address,
                      travel.map,
                      travel.userId,
                      travel.status,
                      rows[0].location_id,
                      travel.id
                    ],
                    function (err, rows) {
                          if(err) return res.json({
                            success: false,
                            message: "try again"
                          });

                          return res.json({
                            success: true,
                            message: "travel agency was updateds correctly"
                          });
                  })
      }else{
        let sql = `INSERT INTO locations (country_id,city_id,state_id) VALUES(?,?,?)`;
        connection.query(sql, [travel.country,travel.city,travel.state],function (err, rows) {
            let sql = `UPDATE travel_agency
                  SET
                  name = ? ,
                  address = ? ,
                  map =? ,
                  users_Id =? ,
                  status = ? ,
                  location_id = ?
                  WHERE id = ?`
                  connection.query(sql,
                    [ travel.name,
                      travel.address,
                      travel.map,
                      travel.userId,
                      travel.status,
                      rows.insertId,
                      travel.id
                    ],
                    function (err, rows) {
                          if(err) return res.json({
                            success: false,
                            message: "try again"
                          });

                          return res.json({
                            success: true,
                            message: "travel agency was updateds correctly"
                          });
                  })
        })
      }
  })

  console.log(travel)
}


/// work
module.exports.deleteTravel = (req, res, next) => {
  travelModel.delete(req.params.id)
    .then(result => {
      if (result[0].affectedRows) {
        return res.json({
          success: true,
          message: "travel agency was deleted correctly"
        });
      }
      return res.json({
        success: false,
        message: "try again"
      });
    })
    .catch(err => {
      res.status(504).json({
        success: false,
        message: "try again",
        err: err.message
      });
    });
}


// work
module.exports.changeStatus = (req, res, next) => {
  const id = req.params.id;
  travelModel.changeStatus(id)
    .then(save_res => {
      if (save_res[0].affectedRows) {
        return res.json({
          success: true,
          message: "travel agency was changed correctly"
        });
      }
      return res.json({
        success: false,
        message: "try again"
      });
    })
    .catch(err => {
      res.status(504).json({
        success: false,
        message: "try again",
        err: err.message
      });
    });
}


//// work
module.exports.getAllTravel = (req, res, next) => {
  travelModel.getAllTravle()
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
      })
    })

}


//// work
module.exports.getAllTravelByStatus = (req, res, next) => {
  travelModel.getAllTravleByStatus(req.params.stat)
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
      })
    })

}

///// work 
module.exports.getAllTravelById = (req, res, next) => {
  travelModel.getAllTravleById(req.params.id)
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
      })
    })

}