const express = require('express');
const path = require("path");
const nodemailer = require('nodemailer');
const fs = require('fs');
var easyinvoice = require('easyinvoice');

const router = express.Router();

//Ruta za dashboard
router.get('/', (req, res) => {
  let moduleTemp = {adminUser: req.session.isAdmin};
  res.render('reports', moduleTemp);
});

module.exports = router;