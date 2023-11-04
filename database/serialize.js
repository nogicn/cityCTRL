const db = require('./db');
const user = require('../models/user');
const parking_space = require('../models/parking_space');
const reservation = require('../models/reservation');
const user_vehicle = require('../models/user_vehicle');

function serialise(){
    db.serialize(() => {
        db.run(user.createUserTable);
        db.run(user.addUser, ["admin", "admin", "admin@gmail.com", "123456789", "admin", new Date()]);
        db.run(user.addUser, ["user", "user", "user@gmail.com", "123456789", "user", new Date()]);
        db.run(parking_space.createParkingSpaceTable);
        db.run(reservation.createReservationTable);
        db.run(user_vehicle.createUserVehicleTable);
    });
}

module.exports = {
    serialise
};