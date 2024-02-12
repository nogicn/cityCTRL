const createReservationTable = `
    CREATE TABLE IF NOT EXISTS reservation (
        id TEXT PRIMARY KEY,
        parking_spot_id TEXT,
        user_id TEXT,
        start_time TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')), -- TEXT to store datetime in ISO8601 format
        end_time TEXT, -- TEXT to store datetime in ISO8601 format
        status TEXT,
        FOREIGN KEY(parking_spot_id) REFERENCES parking_space(id),
        FOREIGN KEY(user_id) REFERENCES user(id)
    );
    `;

const addReservation = `INSERT INTO reservation (id, parking_spot_id, user_id, start_time, end_time, status) VALUES ($id, $parking_spot_id, $user_id, $start_time, $end_time, $status);`;

const getAllReservations = `SELECT * FROM reservation;`;

module.exports = {
    createReservationTable,
    addReservation,
    getAllReservations
};