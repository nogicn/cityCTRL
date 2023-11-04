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
  db.all(user.getAllUsers, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

router.post('/user/authenticateLogin', (req, res) => {
  // Check if the user exists in the database
  //console.log(req.body.email, req.body.password);
  db.get(user.checkIfUserExists, [req.body.email, req.body.password], (err, row) => {
    if (err) {
      res.status(302).send(err.message);
    }else
    if (!row) {
      //console.log(row)
      res.redirect("/");
      return;
    }
  req.session.firstName = row.first_name;
  req.session.isAdmin = row.is_admin;
  var token = jwt.sign({'mail':req.body.email}, 'iamaverystrongsecretyesyes?');
  req.session.token = token;
  //console.log(token)
  db.get(user.updateTokenByEmail, [token, req.body.email], (err, row) => {
    if (err) {
      res.status(302).send(err.message);
    }
      // redirect to get dashboard
      res.redirect("/dashboard");
    
  });
  //console.log(data, "data")
});
});

router.post('/user/logout', (req, res) => {
  // check if the user exists in the database
  db.get(user.checkToken, [req.session.token], (err, row) => {
    if (err) {
      res.status(302).send(err.message);
    }
    if (row) {
      // delete token
      db.get(user.updateTokenByEmail, [null, row.email], (err, row) => {
        if (err) {
          res.status(302).send(err.message);
        }
        // redirect to get dashboard
        req.session.destroy((err) => {
          res.redirect('/') // will always fire after session is destroyed
        })
      });
    } else {
      delete req.session.token;
      req.session.destroy((err) => {
        res.redirect('/') // will always fire after session is destroyed
      })
    }
  });
  delete req.session.token;
  req.session.destroy((err) => {
    res.redirect('/') // will always fire after session is destroyed
  })
  //console.log(data, "data")
});

router.post('/user/registerNewUser', (req, res) => {
  db.run(user.addUser, [req.body.first_name, req.body.last_name, req.body.email, req.body.password, 0, null], (err) => {
    if (err) {
      res.status(302).send(err.message);
    } else {
     db.get(user.getUserByEmail, [req.body.email], (err, row) => {
        if (err) {
          res.status(302).send(err.message);
        }
        var token = jwt.sign({'mail':req.body.email}, 'iamaverystrongsecretyesyes?');
        req.session.token = token;
        db.get(user.updateTokenByEmail, [token, req.body.email], (err, row) => {
          if (err) {
            res.status(302).send(err.message);
          }
          // redirect to get dashboard
          res.redirect("/dashboard");
        });
      });
    }
  });
});

//Ruta za register
router.get('/register', (req, res) => {
  let moduleTemp = {};
  res.render('register', moduleTemp);
});

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  console.log(result);
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