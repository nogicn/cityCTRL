// better sqlite3
const sqlite3 = require('better-sqlite3');

// create database
const db = new sqlite3('./database/db.sqlite3', { verbose: console.log });

module.exports = db;