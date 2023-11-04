const createZoneTable = `
    CREATE TABLE IF NOT EXISTS zone (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        basePrice REAL NOT NULL
    );
`;

const addZone = `INSERT INTO zone (id, name, basePrice) VALUES (?, ?, ?);`;
const getZoneById = `SELECT * FROM zone WHERE id = ?;`;

module.exports = {
    createZoneTable,
    addZone,
    getZoneById
};