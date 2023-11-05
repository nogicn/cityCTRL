const db = require('./db');
const user = require('../models/user');
const parking_space = require('../models/parking_space');
const reservation = require('../models/reservation');
const user_vehicle = require('../models/user_vehicle');
const zone = require('../models/zone');
const notification = require('../models/notification');

function serialise() {
    db.prepare('DROP TABLE IF EXISTS user;').run();
    db.prepare('DROP TABLE IF EXISTS parking_space;').run();
    db.prepare('DROP TABLE IF EXISTS zone;').run();
    db.prepare('DROP TABLE IF EXISTS reservation;').run();
    db.prepare('DROP TABLE IF EXISTS user_vehicle;').run();
    db.prepare('DROP TABLE IF EXISTS notification;').run();
    db.prepare(user.createUserTable).run();
    db.prepare(user.addUser).run(["Admin", "Admin", "admin@gmail.com", "password", 1, null])
    db.prepare(user.addUser).run(["Alen", "Bazant", "alen.bazant@fer.hr", "password", 0, null])
    db.prepare(zone.createZoneTable).run();
    db.prepare(zone.addZone).run([1, "Zona 1", 4.0]);
    db.prepare(zone.addZone).run([2, "Zona 2", 3.0]);
    db.prepare(zone.addZone).run([3, "Zona 3", 2.0]);
    db.prepare(zone.addZone).run([4, "Zona 4", 1.0]);
    db.prepare(parking_space.createParkingSpaceTable).run();
    db.prepare(reservation.createReservationTable).run();
    db.prepare(user_vehicle.createUserVehicleTable).run();
    db.prepare(notification.createNotificationTable).run();
}

module.exports = {
    serialise
};