var express = require('express');
var router = express.Router();
const db = require('../database/db');
const user = require('../models/users');

router.get('/', function(req, res, next) {
    db.all(user.getAllUsers, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

module.exports = router;
