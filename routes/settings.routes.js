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
  const row = db.prepare(user.getUserByEmail).get(req.session.email);
  res.render('settings', row);
  /*db.get(user.getUserByToken, [req.session.token], (err, rows) => {
    if (err) {
      console.log(err.message);
    }
    res.render('settings', rows);
  });*/
});


router.post('/updateUserProfile', (req, res) => {
  const row = db.prepare(user.updateUserWithEmail).run(req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.email);
  console.log(row);
  if (row == undefined) {
    res.status(500).send("Internal Server Error");
    return;
  }
    res.redirect("/settings");
  
  /*db.get(user.updateUserWithEmail, [req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.email], (err, row) => {
    if (err) {
      res.status(302).send(err.message);
    }
    res.redirect("/settings");

  });*/

});


router.post('/deactivateUserProfile', (req, res) => {
  const row = db.prepare(user.deleteUser).run(req.session.email);
  if (row == undefined) {
    res.status(500).send("Internal Server Error");
    return;
  }
  req.session.destroy((err) => {
    res.redirect('/deletedPage') 
  })
  /*db.run(user.deleteUser, [req.body.email], (err, row) => {
    if (err) {
      res.status(302).send(err.message);
    }
    
    res.redirect('/deletedPage');
  });*/
});

module.exports = router;