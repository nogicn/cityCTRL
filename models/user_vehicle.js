const createUserVehicleTable = `
    CREATE TABLE IF NOT EXISTS user_vehicle (
        id TEXT PRIMARY KEY,
        email TEXT,
        registration_plate TEXT,
        FOREIGN KEY (email) REFERENCES user(email),
        UNIQUE (email, registration_plate)
    );
    `;

const addUserVehicle = `INSERT INTO user_vehicle (id, email, registration_plate) VALUES (?, ?, ?);`;

const getAllUserVehicles = `SELECT * FROM user_vehicle;`;

module.exports = {
    createUserVehicleTable,
    addUserVehicle,
    getAllUserVehicles
};