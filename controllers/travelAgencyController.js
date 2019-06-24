const fs = require('fs')
const multer = require('multer');
const travelModel = require('../models/travelAgencyModel')
const descreptionModel = require('../models/descreption');
const insertLocationModel = require('../models/insertedLocationModel')
const connection = require('../utilites/db2')
const imagesModel = require('../models/images');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/images/travelAgencies')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage
});


// work
module.exports.addTravel = (req, res, next) => {
  const travel = {
    name: req.body.name,
    address: req.body.address,
    country: req.body.country,
    city: req.body.city,
    state: req.body.state,
    map: req.body.map,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    userId: req.params.userId,
    description: req.body.description
  }

  travelModel.transactionInsert(res, travel);

}
// work
module.exports.updateTravel1 = (req, res, next) => {
  const travel = {
    name: req.body.name,
    address: req.body.address,
    country: req.body.country,
    city: req.body.city,
    state: req.body.state,
    map: req.body.map,
    status: req.body.status,
    userId: req.body.userId,
    id: req.params.id
  }

  let sql = `select * 
             from locations
             where country_id = ? and
                   city_id 	  = ? and
                   state_id   = ?`
  connection.query(sql, [travel.country, travel.city, travel.state], function (err, rows) {
    if (rows.length) { // location already exist
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
        [travel.name,
          travel.address,
          travel.map,
          travel.userId,
          travel.status,
          rows[0].location_id,
          travel.id
        ],
        function (err, rows) {
          if (err) return res.json({
            success: false,
            message: "try again"
          });

          return res.json({
            success: true,
            message: "travel agency was updateds correctly"
          });
        })
    } else {
      let sql = `INSERT INTO locations (country_id,city_id,state_id) VALUES(?,?,?)`;
      connection.query(sql, [travel.country, travel.city, travel.state], function (err, rows) {
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
          [travel.name,
            travel.address,
            travel.map,
            travel.userId,
            travel.status,
            rows.insertId,
            travel.id
          ],
          function (err, rows) {
            if (err) return res.json({
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

}
//minimize // work
module.exports.updateTravel = (req, res, next) => {
  const travel = {
    name: req.body.name,
    address: req.body.address,
    country: req.body.country,
    city: req.body.city,
    state: req.body.state,
    map: req.body.map,
    status: req.body.status,
    userId: req.body.userId,
    id: req.params.id,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    description: req.body.description
  }
  const locationModel = new insertLocationModel(travel);
  locationModel.count()
    .then(result => {
      if (result[0].length == 0) {
        //console.log('not found ??')
        return locationModel.save();
      } else {
        //console.log('found')
        const travelModelUpdated = new travelModel(travel);
        travelModelUpdated.locationId = result[0][0].location_id;
        travelModelUpdated.id = req.params.id;

        return travelModelUpdated.update();


      }
    })
    .then(result => {
      if (result[0].insertId) {

        //console.log('not found !!')
        const travelModelUpdated = new travelModel(travel);
        travelModelUpdated.locationId = result[0].insertId;
        travelModelUpdated.id = req.params.id;

        return travelModelUpdated.update()
          .then(resule => {
            return res.json({
              success: true,
              message: "travel agency was updated correctly"
            });
          })
          .catch(err => {
            return res.json({
              success: false,
              message: "try again"
            });
          })

      } else {
        return res.json({
          success: true,
          message: "travel agency was updated correctly"
        });

      }

    })
    .catch(err => {
      return res.json({
        success: false,
        message: err.message
      });
    })


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
/// work
module.exports.getAllTravel = (req, res, next) => {
  travelModel.getAllTravle()
    .then(result => {
      if (!result) {
        return res.json({
          success: true,
          status: 404,
          data: 'Data Not found'
        });
      }
      res.json({
        success: true,
        status: 200,
        data: result[0]
      });
    })
    .catch(err => {
      res.json({
        success: false,
        status: 500,
        data: 'Internal error server'
      })
    })

}
//// work
module.exports.getAllTravelByStatus = (req, res, next) => {
  travelModel.getAllTravleByStatus(req.query['status'])
    .then(result => {
      if (!result) {
        return res.json({
          success: false,
          status: 404,
          data: 'Data Not found'
        });
      }
      res.json({
        success: true,
        status: 200,
        data: result[0]
      });
    })
    .catch(err => {
      res.json({
        success: false,
        status: 500,
        data: 'Internal error server',
        error: err
      })
    })

}


module.exports.getTravelAgencyById = (req, res, next) => {
  if (!req.params['travelId']) {
    return res.status(400).json({
      success: false,
      message: "bad requrest"
    })
  }
  travelModel.getTravelAgencyById(req.params['travelId'])
    .then(result => {
      return res.status(200).json({
        success: true,
        message: "ok",
        data: result[0]
      })
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: "error",
        error: err
      })
    })
}

///// work 
module.exports.getAllTravelById = (req, res, next) => {
  travelModel.getAllTravleById(req.params.id)
    .then(result => {
      if (!result) {
        return res.json({
          success: false,
          status: 404,
          data: 'Data Not found'
        });
      }
      res.json({
        success: true,
        status: 200,
        data: result[0]
      });
    })
    .catch(err => {
      res.json({
        success: false,
        status: 500,
        data: 'Internal error server'
      })
    })

}

module.exports.postAddImage = (req, res, next) => {
  console.log(req.body);
  const file = upload.array('image');

  file(req, res, err => {

    if (err) {
      return res.json({
        success: false,
        message: 'Uploading image failed!',
        err: err
      })
    }
    const values = {
      array: req.files,
      travelAgencyId: req.params.travelAgencyId
    }

    imagesModel.addImages(values)
      .then(result => {
        res.status(result.status).json({
          success: result.success,
          message: result.message,
          data: result.data
        })
      })
      .catch(result => {
        res.status(result.status).json({
          success: result.success,
          message: result.message,
          err: result.err
        })
      })

  })


};


exports.deleteImage = (req, res, next) => {


  let imageId = req.params.imageId;
  let image;
  imagesModel.getImageById(imageId)
    .then(result => {
      if (!result[0][0] || !result[0][0].image_id) {
        return res.status(404).json({
          success: false,
          message: 'image Not found!'
        });
      }
      image = result[0][0];
      return imagesModel.deleteImageFromDataBase(imageId);
    })
    .then(result => {
      const path = image.image_path;
      const name = path.split('\\')[3];
      return imagesModel.deleteImageFromFolder(path, imageId);
    })
    .then(result => {
      res.status(result.status).json({
        success: result.success,
        message: result.message
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: 'Internal server error!'
      })

    })



};

exports.getMyTravelAgencies = (req, res, next) => {
  if (!req.params['userId']) {
    return res.status('400').json({
      success: false,
      message: 'bad requrest'
    })
  }
  travelModel.getMyTravelAgencies(req.params['userId'])
    .then(result => {
      return res.status(200).json({
        success: true,
        message: 'ok',
        data: result[0]
      })
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: 'error!!!!',
        error: err
      })
    })
};


// module.exports.getAllImgaesByTravelAgencyId = (clinicId) => {

//   return db.execute(
//     `select image_id, image_path from travel_agency left join images
//        on travel_agency.id=images.travel_agency_id where travel_agency.id=?`,
//     [clinicId]
//   );

// };

exports.getAllImagesByTravelId = (req, res, next) => {
  const data = [] ;
  imagesModel.getAllImgaesByTravelId(req.params.travelId)
      .then(result => {
          result[0].forEach(image => {
              data.push({id: image.image_id, name: image.image_name});
          })
          res.status(200).json({
              success: true,
              message: 'Getting all images for an travel agency.',
              data: data
          })
      })
      .catch(err => {

          res.status(500).json({
              success: false,
              message: 'Internal server error!',
              err: err
          })
      })

};

exports.putAddDescreption = (req, res, next) => {
  descreptionModel.addDescreption('travel_agency', req.body.descreption, -1, req.params.travelId)
    .then(result => {
      res.status(200).json({
        success: true,
        message: 'Adding descreption successfully.'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Internal server error!'
      })
    })

};


exports.getDescreption = (req, res, next) => {

  descreptionModel.getDescreption('travel_agency', req.params.travelId)
    .then(result => {
      res.status(200).json({
        success: true,
        message: 'Getting descreption successfully.',
        data: result[0][0]
      })
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: 'Getting descreption failed!',
        err: err
      })
    })

};