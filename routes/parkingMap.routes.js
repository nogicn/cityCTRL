const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const path = require("path");
const user = require('../models/user');
const db = require('../database/db');
const router = express.Router();
const checkAuth = require('../middleware/authorisation.middleware');
const reservation = require('../models/reservation');
const parking_space = require('../models/parking_space');
// create jwt token
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { runInNewContext } = require('vm');
const saltRounds = 10;

const axios = require('axios');


//Ruta za login
router.get('/', (req, res) => {
  let moduleTemp = { adminUser: req.session.isAdmin, usageByZone: [["ZZGasfa", 1000, 2313]] };

  // Create an array of promises for the database queries
  const promises = [
    new Promise((resolve, reject) => {
      db.all(reservation.getReservationsByEmail, [req.session.email], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          var tempLista = []
          console.log()
          rows.forEach((row) => {
           var temp = [];
           temp[0] = row.registration_plate;
           temp[1] = row.start_time;
           temp[2] = row.end_time;
           tempLista.push(temp);
          })

          moduleTemp.usageByZone = tempLista;
          resolve();
        }
      });
    }),
  ];

  const promises2 = [
    new Promise((resolve, reject) => {
      db.all(parking_space.getAllParkingSpaces, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const formattedParkingSpaces = rows.map(row => {
            const status = row.occupied ? "occupied" : "free";

            return {
              lat: row.latitude,
              lng: row.longitude,
              status: status

            };
          });
  
          // Convert the formatted data to a JSON string
          const jsonData = JSON.stringify(formattedParkingSpaces, null, 2);
  
          // Define the file path in the "public" folder
          const filePath = path.join(__dirname, '../public', 'parking-spots.json');
  
          // Write the data to the file
          fs.writeFile(filePath, jsonData, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log('Parking space data written to public/parkingSpaces.json');
              resolve(formattedParkingSpaces);
            }
          });
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
  var durationOfReservation = req.body.timeOfReservation;
  const [hours, minutes] = durationOfReservation.split(' ').map((time) => parseInt(time));
  const startTime = new Date();
  const endTime = new Date(startTime.getTime());
  endTime.setHours(startTime.getHours() + hours);
  endTime.setMinutes(startTime.getMinutes() + minutes);
  const startTimeStr = startTime.toISOString();
  const endTimeStr = endTime.toISOString();
  var address = req.body.address;
  var type = req.body.type;
  switch (type) {
    case 'regular':
      type = 1;
      break;
    case 'handicap':
      type = 2;
      break;
    case 'electric':
      type = 3;
      break;
    default:
      type = 1;
      break;
  }
  var price = req.body.price;
  var latitude;
  var longitude;


  axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: address + ', Zagreb',
      format: 'json',
    }
  })
    .then(response => {
      const result = response.data[0];
      if (result) {
        latitude = result.lat;
        longitude = result.lon;

        db.get(parking_space.getFreeParkingSpacesInArea, [type, price, latitude, longitude, latitude], (err, row) => {
          if (err) {
            return res.status(302).send(err.message);
          } else {
            if (row) {
              console.log(1);
              db.run(reservation.addReservation, [row.id, req.session.email, plateNumber, startTimeStr, endTimeStr], (err) => {
                console.log(2);
                if (err) {
                  return res.status(302).send(err.message);
                } else {
                  res.redirect('/parkingMap');
                  return;
                }
              });
            } else {
              return res.status(302).send('No free parking spaces found in the given area.');
              res.redirect('/parkingMap');
            }
          }
        });

      } else {
        console.log('No results found for the given address in Zagreb.');
        res.redirect('/parkingMap');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

});

module.exports = router;