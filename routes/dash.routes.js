const express = require('express');
const path = require("path");
const nodemailer = require('nodemailer');
const fs = require('fs');
var easyinvoice = require('easyinvoice');
const db = require('../database/db');
const spaces = require('../models/parking_space');
const router = express.Router();

router.get('/', (req, res) => {
  console.log("tu sam");
  let reso = "";
  let moduleTemp = {
    firstName: req.session.firstName,
    adminUser: req.session.isAdmin,
    freeSpaces: 1,
    occupiedSpaces: 1,
    totalSpaces: 1,
    totalProfit: 1,
    usageByZone: [["Zona 1", 1000, 2313, 1], ["Zona 2", 1000, 2313, 1], ["Zona 3", 1000, 2313, 1], ["Zona 4", 1000, 2313, 1]],
  };

  // Create an array of promises for the database queries
  const promises = [
    new Promise((resolve, reject) => {
      const rows = db.prepare(spaces.getAllParkingSpaces).all();
      moduleTemp.totalSpaces = rows.length;
      moduleTemp.freeSpaces = rows.filter(x => x.occupied === 0).length;
      moduleTemp.occupiedSpaces = rows.filter(x => x.occupied === 1).length;
      resolve();
    }),
  ];

  for (let i = 1; i < 5; i++) {
    promises.push(
      new Promise((resolve, reject) => {
        const rows = db.prepare(spaces.getParkingSpacesByZone).all(i);
        moduleTemp.usageByZone[i - 1][1] = rows.filter(x => x.occupied === 0).length;
        moduleTemp.usageByZone[i - 1][2] = rows.filter(x => x.occupied === 1).length;
        resolve();
      })
    );
  }

  // Use Promise.all to wait for all promises to complete
  Promise.all(promises)
    .then(() => {
      console.log(moduleTemp);
      res.render('dashboard', moduleTemp);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

router.get('/downloadDailyReport', (req, res) => {
  console.log(234234)
  // Sample data for the report (you can replace this with your actual data)
  const randomData = {
    water: [/* Water consumption data */],
    energy: [/* Energy consumption data */],
    gas: [/* Gas consumption data */],
    profit: [/* Profit data */],
  };

  const invoiceData = {
    document: {
      title: '24-Hour Report',
      number: '001',
      footer: 'Generated by Your App',
    },
    client: {
      company: 'Client Company',
      address: '123 Client St, City',
      email: 'client@email.com',
    },
    items: [
      // Add items for water, energy, gas, and profit here
    ],
  };

  // Generate the PDF invoice
  easyinvoice.createInvoice(invoiceData, function (result) {
    const pdfBuffer = Buffer.from(result.pdf, 'base64');

    // Save the PDF to a file (optional)
    fs.writeFileSync('data/24-hour-report.pdf', pdfBuffer);

    // Send the PDF as a response to the client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="24-hour-report.pdf"');
    res.send(pdfBuffer);
    console.log(234234)
  });
});


module.exports = router;