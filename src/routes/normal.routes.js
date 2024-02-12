var express = require('express');
var parking = require('../middleware/parking');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/parking", function(req, res, next) {
  res.json(parking.getAllParking());
});

module.exports = router;
