const createReservationTable = `
    CREATE TABLE IF NOT EXISTS reservation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parking_spot_id TEXT,
        email TEXT,
        registration_plate TEXT,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        status TEXT DEFAULT 'active' NOT NULL,
        FOREIGN KEY(parking_spot_id) REFERENCES parking_space(id),
        FOREIGN KEY(email) REFERENCES user(email)
    );
    `;

const addReservation = `INSERT INTO reservation (parking_spot_id, email, registration_plate, start_time, end_time) VALUES (?, ?, ?, ?, ?);`;

const getAllReservations = `SELECT * FROM reservation;`;

const getReservationsByEmail = `SELECT * FROM reservation WHERE email = ?;`;

module.exports = {
    createReservationTable,
    addReservation,
    getAllReservations,
    getReservationsByEmail
};