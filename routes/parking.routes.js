var express = require('express');
var parking = require('../middleware/parking');
var router = express.Router();

router.get("/", function(req, res, next) {
  let json = parking.getAllParking().then(function (response) {
    response = JSON.parse(response);
    res.json(response);
  });
});

router.post("/", function(req, res, next) {
  let json = parking.addParking(req.body).then(function (response) {
    response = JSON.parse(response);
    res.json(response);
  });
});

router.post("/reserve", function(req, res, next) {
  let json = parking.reserveParking(req.body).then(function (response) {
    response = JSON.parse(response);
    res.json(response);
  });
});

router.delete("/", function(req, res, next) {
  let json = parking.deleteParking(req.body).then(function (response) {
    response = JSON.parse(response);
    res.json(response);
  });
});


module.exports = router;
