const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const user = require('../models/user');
const db = require('../database/db');
const router = express.Router();
const checkAuth = require('../middleware/authorisation.middleware');
const spaces = require('../models/reservation');
// create jwt token
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { runInNewContext } = require('vm');
const saltRounds = 10;

const axios = require('axios');


//Ruta za login
router.get('/', (req, res) => {
  let moduleTemp = {adminUser: req.session.isAdmin, usageByZone: [["ZZGasfa", 1000, 2313]]};

  // Create an array of promises for the database queries
  const promises = [
    new Promise((resolve, reject) => {
      db.all(spaces.getReservationsByEmail, [req.session.email], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          var tempLista = []
          console.log()
          rows.forEach((row) => {
            console.log(row);
          })

          moduleTemp.usageByZone = tempLista;
          resolve();
        }
      });
    }),
  ];

  // Use Promise.all to wait for all promises to complete
  Promise.all(promises)
    .then(() => {
      console.log(moduleTemp);
      res.render('parkingMap', moduleTemp);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

//Ruta za dashboard
router.post('/reserveParkingSpot', (req, res) => {
  var plateNumber = req.body.plateNum;
  var timOfReservation = req.body.timOfReservation;
  var address = req.body.address;
  var type = req.body.type;
  var price = req.body.price;
  console.log("Plate Number: " + req.body.plateNum);
console.log("Time of Reservation: " + req.body.timOfReservation);
console.log("Address: " + req.body.address);
console.log("Type: " + req.body.type);
console.log("Price: " + req.body.price);
var latitude;
      var longitude ;

  // Make a request to the Nominatim API
  axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: address,
      format: 'json',
    }
  })
  .then(response => {
    const result = response.data[0];
    if (result) {
      latitude = result.lat;
      longitude = result.lon;
      console.log(`Latitude: ${latitude}`);
      console.log(`Longitude: ${longitude}`);
    } else {
      console.log('No results found for the given address.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });


  res.redirect('parkingMap');
});

module.exports = router;