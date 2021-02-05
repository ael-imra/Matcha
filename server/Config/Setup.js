const mysql = require('mysql')
const fs = require('fs')
require('dotenv').config()
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  multipleStatements: true,
})
fs.readFile('./database.sql', (err, data) => {
  pool.query(data.toString(), (err) => {
    if (err) throw err
    console.log('Database Created')
    pool.end()
  })
})
