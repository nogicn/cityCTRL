const createReservationTable = `
    CREATE TABLE IF NOT EXISTS reservation (
        id TEXT PRIMARY KEY,
        parking_spot_id TEXT,
        user_id TEXT,
        registration_plate TEXT,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        status TEXT DEFAULT 'active' NOT NULL,
        FOREIGN KEY(parking_spot_id) REFERENCES parking_space(id),
        FOREIGN KEY(user_id) REFERENCES user(id)
    );
    `;

const addReservation = `INSERT INTO reservation (id, parking_spot_id, user_id, registration_plate, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?, ?);`;

const getAllReservations = `SELECT * FROM reservation;`;

const getReservationsByEmail = `SELECT * FROM reservation WHERE email = ?;`;

module.exports = {
    createReservationTable,
    addReservation,
    getAllReservations,
    getReservationsByEmail
};