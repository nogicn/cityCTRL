const createZoneTable = `
    CREATE TABLE IF NOT EXISTS zone (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        basePrice REAL NOT NULL,
`;

const addZone = `INSERT INTO zone (id, name, basePrice) VALUES ($id, $name, $basePrice);`;
const getZoneById = `SELECT * FROM zone WHERE id = $id;`;