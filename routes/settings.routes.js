const express = require('express');
const path = require("path");
const nodemailer = require('nodemailer');
const fs = require('fs');
const db = require('../database/db');
const user = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  db.get(user.getUserByEmail, ["admin@gmail.com"], (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    console.log(rows);
    res.render('settings', rows);
  });
});


router.get('/updateUserProfile', (req, res) => {
  
  res.render('settings', moduleTemp);
});


router.get('/deactivateUserProfile', (req, res) => {
  let moduleTemp = {};
  res.render('settings', moduleTemp);
});

module.exports = router;