const db = require('./db');
const user = require('../models/users');

function serialise(){
    db.serialize(() => {
        db.run(user.createUserTable);
        db.run(user.addUser, ["admin", "admin", "admin@gmail.com", "123456789", "admin", new Date()]);
        db.run(user.addUser, ["user", "user", "user@gmail.com", "123456789", "user", new Date()]);
    });
}

module.exports = {
    serialise
};