const createParkingSpaceTable = `
    CREATE TABLE IF NOT EXISTS parking_space (
        id TEXT PRIMARY KEY,
        latitude REAL,
        longitude REAL,
        zone INTEGER,
        occupied INTEGER, -- INTEGER as a substitute for BOOLEAN
        occupied_timestamp TEXT, -- TEXT to store datetime in ISO8601 format
        CONSTRAINT valid_zone_number CHECK (zone >= 1 AND zone <= 4),
        UNIQUE (latitude, longitude)
    );
`;

const addParkingSpace = `INSERT INTO parking_space (id, latitude, longitude, zone, occupied, occupied_timestamp) VALUES ($id, $latitude, $longitude, $zone, $occupied, $occupied_timestamp);`;

const getAllParkingSpaces = `SELECT * FROM parking_space;`;

module.exports = {
    createParkingSpaceTable,
    addParkingSpace,
    getAllParkingSpaces
};