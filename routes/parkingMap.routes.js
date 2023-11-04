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
  let moduleTemp = {adminUser: req.session.isAdmin, usageByZone: [["ZZGasfa", 1000, 2313]]};
  res.render('parkingMap', moduleTemp);
});

module.exports = router;