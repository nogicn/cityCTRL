const db = require('../database/db');
const user = require('../models/user');

const checkAuth = (req, res, next) => {
    // print all users
    db.all(user.getAllUsers, [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
    });

    // check if the user exists in the database
    console.log(req.session.token);
    db.get(user.checkToken, [req.session.token], (err, row) => {
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