const createNotificationTable = `
    CREATE TABLE IF NOT EXISTS notification (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        message TEXT,
        FOREIGN KEY(user_id) REFERENCES user(id)
    );
`;

const getNotificationsByUserId = `SELECT * FROM notification WHERE user_id = ?;`;
const getNotificationsByEmail = `SELECT notification.*
    FROM notification JOIN user
    ON notification.user_id = user.id
    WHERE user.email = ?;
`;

module.exports = {
    createNotificationTable,
    getNotificationsByUserId,
    getNotificationsByEmail
};