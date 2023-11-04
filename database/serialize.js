const db = require('./db');
const user = require('../models/user');
const parking_space = require('../models/parking_space');
const reservation = require('../models/reservation');
const user_vehicle = require('../models/user_vehicle');

function serialise(){
    db.serialize(() => {
        db.run(user.createUserTable);
        db.run(user.addUser, ["Admin", "Admin", "admin@gmail.hr", "password", 1, null])
        db.run(user.addUser, ["Alen", "Bazant", "alen.bazant@fer.hr", "password", 0, null])
        db.run(parking_space.createParkingSpaceTable);
        db.run(reservation.createReservationTable);
        db.run(user_vehicle.createUserVehicleTable);
    });
}

module.exports = {
    serialise
};