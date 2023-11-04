const express = require('express');
const path = require("path");
const nodemailer = require('nodemailer');
const fs = require('fs');
const db = require('../database/db');
const user = require('../models/user');
const e = require('express');

const router = express.Router();
// use body parser
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
  db.get(user.getUserByEmail, ["admin@gmail.com"], (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    res.render('settings', rows);
  });
});


router.post('/updateUserProfile', (req, res) => {
  db.get(user.updateUserwithEmail, [req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.email], (err, row) => {
    if (err) {
      res.status(302).send(err.message);
    }
      res.redirect("/settings");
    
  });
 
});


router.get('/deactivateUserProfile', (req, res) => {
  let moduleTemp = {};
  res.render('settings', moduleTemp);
});

module.exports = router;