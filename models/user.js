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
            UNIQUE (email)
);
    `;

const addUser = `INSERT INTO user (first_name, last_name, email, password_hash, is_admin, phone_number) VALUES (?, ?, ?, ?, ?, ?);`;
const deleteUser = `DELETE FROM user WHERE email = $email;`;

const getAllUsers = `SELECT * FROM user;`;
const getUserByEmail = `SELECT * FROM user WHERE email = ?;`;

const getTokenByEmail = `SELECT token FROM user WHERE email = $email;`;
const updateTokenByEmail = `UPDATE user SET token = $token WHERE email = $email;`;

const checkIfUserExists = `SELECT * FROM user WHERE email = $email AND password_hash = $password_hash;`;

const getUserById = `SELECT * FROM user WHERE id = $id;`;

module.exports = {
    createUserTable,
    addUser,
    getAllUsers,
    getUserByEmail,
    deleteUser,
    getTokenByEmail,
    updateTokenByEmail,
    checkIfUserExists,
    getUserById
};