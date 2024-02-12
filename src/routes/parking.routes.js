var express = require('express');
var parking = require('../middleware/parking.middleware');
const db = require('../database/db');
const parkingSpace = require('../models/parking_space');
var router = express.Router();

router.get("/", function(req, res, next) {
  let json = parking.getAllParking()
  console.log(json);
  res.status(200).json(json);
});

router.get("/all", function(req, res, next) {
  db.all(parkingSpace.getAllParkingSpaces, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
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
