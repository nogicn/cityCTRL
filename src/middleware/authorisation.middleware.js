const db = require('better-sqlite3')('./database/db.sqlite3', { verbose: console.log });
const user = require('../models/user');

const checkAuth = (req, res, next) => {
    // get all users
    console.log(db.prepare(user.getAllUsers).run());
    // check if the user exists in the database
    //console.log(req.session.token);
    // check if token is valid
    const result = db.prepare(user.checkToken).get(req.session.token);
    console.log(result);
    if (result == undefined) {
        res.redirect('/login');
        return;
    }else{
        next();
    }
    
}

module.exports = checkAuth;