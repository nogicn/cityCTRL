const db = require('./db');
const user = require('../models/user');
const parking_space = require('../models/parking_space');
const reservation = require('../models/reservation');
const user_vehicle = require('../models/user_vehicle');
const zone = require('../models/zone');

function serialise(){
    db.serialize(() => {
        db.run(user.createUserTable);
        db.run(user.addUser, ["Admin", "Admin", "admin@gmail.com", "password", 1, null])
        db.run(user.addUser, ["Alen", "Bazant", "alen.bazant@fer.hr", "password", 0, null])
        db.run(zone.createZoneTable);
        db.run(zone.addZone, [1, "Zona 1", 1.0]);
        db.run(zone.addZone, [2, "Zona 2", 2.0]);
        db.run(zone.addZone, [3, "Zona 3", 3.0]);
        db.run(zone.addZone, [4, "Zona 4", 4.0]);
        db.run(parking_space.createParkingSpaceTable);
        db.run(reservation.createReservationTable);
        db.run(user_vehicle.createUserVehicleTable);
    });
}

module.exports = {
    serialise
};