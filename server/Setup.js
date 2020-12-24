const mysql = require('mysql')
const fs = require('fs')
let connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'Test12345@',
  multipleStatements: true,
})
fs.readFile('./database.sql', (err, data) => {
  connection.query(data.toString(), (err) => {
    if (err) throw err
    console.log('Database Created')
    connection.destroy()
  })
})
