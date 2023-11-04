const createParkingSpaceTable = `
    CREATE TABLE IF NOT EXISTS parking_space (
        id TEXT PRIMARY KEY,
        latitude REAL,
        longitude REAL,
        zone_id INTEGER,
        type INTEGER DEFAULT 1, -- regular(1), handicap(2), electric(3)
        occupied INTEGER,
        occupied_timestamp TEXT,
        CONSTRAINT valid_zone_number CHECK (zone >= 1 AND zone <= 4),
        FOREIGN KEY(zone_id) REFERENCES zone(id),
        UNIQUE (latitude, longitude)
    );
`;

const addParkingSpace = `INSERT INTO parking_space (id, latitude, longitude, zone, occupied, occupied_timestamp) VALUES ($id, $latitude, $longitude, $zone, $occupied, $occupied_timestamp);`;
const removeParkingSpace = `DELETE FROM parking_space WHERE id = $id;`;

const getAllParkingSpaces = `SELECT * FROM parking_space;`;
const getRegularParkingSpaces = `SELECT * FROM parking_space WHERE type = 1;`;
const getHandicapParkingSpaces = `SELECT * FROM parking_space WHERE type = 2;`;
const getElectricParkingSpaces = `SELECT * FROM parking_space WHERE type = 3;`;

const getOccupiedParkingSpaces = `SELECT * FROM parking_space WHERE occupied = 1;`;
const getUnoccupiedParkingSpaces = `SELECT * FROM parking_space WHERE occupied = 0;`;

const getSpacesCheaperThan = `SELECT *
FROM parking_space JOIN zone
ON parking_space.zone_id = zone.id
WHERE zone = $zone AND type = $type AND occupied = 0 AND basePrice < $basePrice;`;

module.exports = {
    createParkingSpaceTable,
    addParkingSpace,
    getAllParkingSpaces
};