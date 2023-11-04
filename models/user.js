const createUserTable =
        `
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_admin INTEGER NOT NULL,
            phone_number TEXT,
            token TEXT,
            UNIQUE (email),
            created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now')) -- TEXT to store datetime in ISO8601 format
);
    `;

const addUser = `INSERT INTO user (first_name, last_name, email, password_hash, is_admin, phone_number) VALUES ($id, $first_name, $last_name, $email, $password_hash, $is_admin, $phone_number);`;
const deleteUser = `DELETE FROM user WHERE email = $email;`;

const getAllUsers = `SELECT * FROM user;`;
const getUserByEmail = `SELECT * FROM user WHERE email = $email;`;

const getTokenByEmail = `SELECT token FROM user WHERE email = $email;`;
const updateTokenByEmail = `UPDATE user SET token = $token WHERE email = $email;`;


module.exports = {
    createUserTable,
    addUser,
    getAllUsers
};