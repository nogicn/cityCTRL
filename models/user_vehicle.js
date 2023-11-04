const createUserVehicleTable = `
    CREATE TABLE IF NOT EXISTS user_vehicle (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        registration_plate TEXT,
        FOREIGN KEY (user_id) REFERENCES user(id),
        UNIQUE (user_id, registration_plate)
    );
    `;

const addUserVehicle = `INSERT INTO user_vehicle (id, user_id, registration_plate) VALUES (?, ?, ?);`;

const getAllUserVehicles = `SELECT * FROM user_vehicle;`;

module.exports = {
    createUserVehicleTable,
    addUserVehicle,
    getAllUserVehicles
};