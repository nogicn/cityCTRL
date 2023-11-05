const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const user = require('../models/user');
const db = require('../database/db');
const router = express.Router();
const checkAuth = require('../middleware/authorisation.middleware');
// create jwt token
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;


//Ruta za login
router.get('/', (req, res) => {
  let moduleTemp = {};
  res.render('login', moduleTemp);
});

//Ruta za login
router.get('/changePassword', (req, res) => {
  let moduleTemp = {};
  res.render('changePassword', moduleTemp);
});

router.get('/deletedPage', (req, res) => {
  let moduleTemp = {};
  res.render('DeletedPage', moduleTemp);
});

router.get("/user/", checkAuth, (req, res) => {
  //get all users from database
  const result = db.prepare(user.getAll).all();
  res.json(result);
});

router.post('/user/authenticateLogin', (req, res) => {
  let row = db.prepare(user.checkIfUserExists).get(req.body.email, req.body.password);
  if ( row == undefined) {
    res.redirect("/");
    return;
  }
  console.log(row);
  req.session.firstName = row.first_name;
  req.session.isAdmin = row.is_admin;
  req.session.email = row.email;
  var token = jwt.sign({'mail':req.body.email}, 'iamaverystrongsecretyesyes?');
  req.session.token = token;

  if ( db.prepare(user.updateTokenByEmail).run(token, req.body.email) == undefined) {
    res.redirect("/");
    return;
  }
  res.redirect("/dashboard");

});


router.post('/user/logout', (req, res) => {
  // check if the user exists in the database
  if (db.prepare(user.checkToken).get(req.session.token) == undefined) {
    res.redirect("/");
    return;
  }
  let update = db.prepare(user.updateTokenByEmail).run(null, req.session.email);
  if (update.changes == 0) {
    res.status(302).send("Error");
    return;
  }
  req.session.destroy((err) => {
    req.session.firstName = undefined
    req.session.isAdmin = undefined
    req.session.email = undefined
    res.redirect('/') 
  })
});

router.post('/user/registerNewUser', (req, res) => {
  if (db.prepare(user.addUser).run(req.body.first_name, req.body.last_name, req.body.email, req.body.password, 0, null).changes == 0) {
    res.redirect("/");
    return;
  }else{
    if (db.prepare(user.getUserByEmail).get(req.body.email) == undefined) {
      res.redirect("/");
      return;
    }else{
      var token = jwt.sign({'mail':req.body.email}, 'iamaverystrongsecretyesyes?');
      req.session.token = token;
      if (db.prepare(user.updateTokenByEmail).run(token, req.body.email) == undefined) {
        res.redirect("/");
        return;
      }
      res.redirect("/dashboard");
    }
  }
});

//Ruta za register
router.get('/register', (req, res) => {
  let moduleTemp = {};
  res.render('register', moduleTemp);
});

router.post('/sendPaswordReset', (req, res) => {
  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // SMTP server host for Gmail
  port: 587, // SMTP port for TLS
  secure: false, // false for TLS - as long as you're not using SSL
    auth: {
      user: '',
      pass: '',
    },
  });

  // Define the email content
  const mailOptions = {
    from: 'your@gmail.com', // Sender's email address
    to: 'recipient@example.com', // Recipient's email address
    subject: 'Password Reset CityCTRL', // Email subject
    html: '<p>Click the following link to reset your password:</p><a href="http://.com/changePassword">Reset Password</a>',
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  res.redirect("/");
});

module.exports = router;