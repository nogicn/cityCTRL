const express = require('express');
const path = require("path");
const nodemailer = require('nodemailer');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
  let user = { user: {
    id : 1,
    first_name : "Ivan",
    last_name : "Ivic",
    email : "lmao",
    password_hash : "lmao",
    is_admin : 1,
    phone_number : "91239192319",
  },
  };
  res.render('settings', user);
});


router.get('/updateUserProfile', (req, res) => {
  
  res.render('settings', moduleTemp);
});


router.get('/deactivateUserProfile', (req, res) => {
  let moduleTemp = {};
  res.render('settings', moduleTemp);
});

module.exports = router;