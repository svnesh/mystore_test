const mysql = require('mysql');
const dotenv = require("dotenv");

dotenv.config();

exports.db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,    
})