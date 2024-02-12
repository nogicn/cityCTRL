const createNotificationTable = `
    CREATE TABLE IF NOT EXISTS notification (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        message TEXT,
        FOREIGN KEY(email) REFERENCES user(email)
    );
`;


const getNotificationsByEmail = `SELECT * FROM notification WHERE email = ?;
`;

module.exports = {
    createNotificationTable,
    getNotificationsByEmail
};