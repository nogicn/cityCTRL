const express = require('express');
const path = require("path");
const nodemailer = require('nodemailer');
const fs = require('fs');

const router = express.Router();

//Ruta za login
router.get('/', (req, res) => {
  let moduleTemp = {};
  res.render('settings', moduleTemp);
});

module.exports = router;