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
const parkingMiddleware = require('../middleware/parking.middleware');
var easyinvoice = require('easyinvoice');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { runInNewContext } = require('vm');
const saltRounds = 10;
const axios = require('axios');
const PDFDocument = require('pdfkit'); // Import the pdfkit library



// Ruta za login
router.get('/', (req, res) => {
  const moduleTemp = { adminUser: req.session.isAdmin, usageByZone: [["ZZGasfa", 1000, 2313]] };

  // Create an array of promises for the database queries
  const promises = [
    new Promise((resolve, reject) => {
      const rows = db.prepare(reservation.getReservationsByEmail).all(req.session.email);
      const tempLista = rows.map((row) => [row.registration_plate, row.start_time, row.end_time]);
      moduleTemp.usageByZone = tempLista;
      resolve();
    }),
  ];

  const promises2 = [
    new Promise((resolve, reject) => {
      const rows = db.prepare(parking_space.getAllParkingSpaces).all();
      const formattedParkingSpaces = rows.map(row => {
        const status = row.occupied ? "occupied" : "free";
        return {
          lat: row.latitude,
          lng: row.longitude,
          status: status,
          type: row.type,
        };
      });

      const jsonData = JSON.stringify(formattedParkingSpaces, null, 2);
      const filePath = path.join(__dirname, '../public', 'parking-spots.json');

      fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Parking space data written to public/parkingSpaces.json');
          resolve(formattedParkingSpaces);
        }
      });
    }),
  ];

  // Use Promise.all to wait for all promises to complete
  Promise.all(promises.concat(promises2))
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
router.post('/reserveParkingSpot', async (req, res) => {
  try {
    const plateNumber = req.body.plateNum;
    const durationOfReservation = req.body.timeOfReservation;
    const [hours, minutes] = durationOfReservation.split(' ').map((time) => parseInt(time));
    const startTime = new Date();
    const endTime = new Date(startTime.getTime());
    endTime.setHours(startTime.getHours() + hours);
    endTime.setMinutes(startTime.getMinutes() + minutes);
    const startTimeStr = startTime.toISOString();
    const endTimeStr = endTime.toISOString();
    const address = req.body.address;
    let type = 1;

    switch (req.body.type) {
      case 'handicap':
        type = 2;
        break;
      case 'electric':
        type = 3;
        break;
    }

    const price = req.body.price;

    // Use axios to fetch latitude and longitude from the address
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address + ', Zagreb',
        format: 'json',
      }
    });

    const result = response.data[0];

    if (result) {
      const latitude = result.lat;
      const longitude = result.lon;

     
      const row = db.prepare(parking_space.getFreeParkingSpacesInArea).get(type, price, latitude, longitude, latitude);
      console.log(row);
      if (row) {
        const data = {
          parkingSpotId: row.space_id,
          endM: endTime.getMinutes(),
          endH: endTime.getHours(),
        };
        
        db.transaction(() => {
          db.prepare(reservation.addReservation).run(row.space_id, req.session.email, plateNumber, startTimeStr, endTimeStr);
          db.prepare(parking_space.updateParkingSpace).run(1, startTimeStr, row.space_id);
        })();
        parkingMiddleware.reserveParking(data);

        res.redirect('/parkingMap');
      } else {
        return res.status(302).send('No free parking spaces found in the given area.');
      }
    } else {
      throw new Error('Location not found');
    }
  } catch (err) {
    console.error('Error:', err.message);
    res.status(302).send(err.message);
  }
});

module.exports = router;