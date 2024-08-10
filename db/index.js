// db/index.js
const mysql = require('mysql2/promise');
const { drizzle } = require('drizzle-orm/mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'makanan',
    password: 'passwordMakanan',
    database: 'sistem_pemesanan_makanan_pim',
    port: 3306,
});

const db = drizzle(pool);

module.exports = { pool };
