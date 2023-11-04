// create sql user model

const createUserTable =
        `
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_date TIMESTAMP,
        isAdmin BOOLEAN DEFAULT false
        );
    `;

const addUser = `INSERT INTO users (name, surname, email, phone, password, created_date) VALUES (?, ?, ?, ?, ?, ?)RETURNING *;`;

const getAllUsers = `SELECT * FROM users;`;

module.exports = {
    createUserTable,
    addUser,
    getAllUsers
};