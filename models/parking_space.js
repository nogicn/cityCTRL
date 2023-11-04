const createParkingSpaceTable = `
    CREATE TABLE IF NOT EXISTS parking_space (
        id TEXT PRIMARY KEY,
        latitude REAL,
        longitude REAL,
        zone_id INTEGER,
        type INTEGER DEFAULT 1, -- regular(1), handicap(2), electric(3)
        occupied INTEGER,
        occupied_timestamp TEXT,
        CONSTRAINT valid_zone_number CHECK (zone_id >= 1 AND zone_id <= 4),
        FOREIGN KEY(zone_id) REFERENCES zone(id),
        UNIQUE (latitude, longitude)
    );
`;

const addParkingSpace = `INSERT INTO parking_space (id, latitude, longitude, zone_id, occupied, occupied_timestamp) VALUES (? ,?, ?, ?, ?, ?);`;
const removeParkingSpace = `DELETE FROM parking_space WHERE id = ?;`;

const updateParkingSpace = `UPDATE parking_space SET occupied = ?, occupied_timestamp = ? WHERE id = ?;`;

const getAllParkingSpaces = `SELECT * FROM parking_space;`;
const getRegularParkingSpaces = `SELECT * FROM parking_space WHERE type = 1;`;
const getHandicapParkingSpaces = `SELECT * FROM parking_space WHERE type = 2;`;
const getElectricParkingSpaces = `SELECT * FROM parking_space WHERE type = 3;`;

const getParkingSpacesByZone = `SELECT * FROM parking_space WHERE zone_id = ?;`;

const getOccupiedParkingSpaces = `SELECT * FROM parking_space WHERE occupied = 1;`;
const getUnoccupiedParkingSpaces = `SELECT * FROM parking_space WHERE occupied = 0;`;

const getFreeParkingSpacesInArea = `SELECT *
FROM parking_space JOIN zone
ON parking_space.zone_id = zone.id
WHERE type = ? AND occupied = 0 AND basePrice < ? AND
ABS(latitude - ?) < 0.0009 AND ABS(longitude - ?) < (0.0009 / COS(RADIANS(?)));
;`;



module.exports = {
    createParkingSpaceTable,
    addParkingSpace,
    getAllParkingSpaces,
    getRegularParkingSpaces,
    getHandicapParkingSpaces,
    getElectricParkingSpaces,
    getParkingSpacesByZone,
    getOccupiedParkingSpaces,
    getUnoccupiedParkingSpaces,
    getFreeParkingSpacesInArea
};