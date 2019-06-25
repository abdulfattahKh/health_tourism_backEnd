const express = require('express');
const imagesController = require('../controllers/imagesController');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/images/shared");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage
});

router.post('/addImages', upload.array('image', 5), imagesController.addImages);
// router.delete('/deleteImage', imagesController.deleteImage);


module.exports = router;