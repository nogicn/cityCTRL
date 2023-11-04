const db = require('../database/db');
const user = require('../models/users');

const checkAuth = (req, res, next) => {
    // print all users
    db.all(user.getAllUsers, [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
    });

    // check if the user exists in the database
    console.log(req.headers["authorization"]);
    db.get(user.checkToken, [req.headers["authorization"]], (err, row) => {
        if (err) {
            res.status(302).send(err.message);
        }
        if (row) {
            next();
        } else {
            res.send("NOT OK")
            //res.redirect("/");
        }
    });
}

module.exports = checkAuth;