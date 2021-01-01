const mysql = require('mysql')
require('dotenv').config({
  path:'../.env'
})

const pool = mysql.createPool({
  host:process.env.MYSQL_HOST,
  port:process.env.MYSQL_PORT,
  user:process.env.MYSQL_USER,
  password:process.env.MYSQL_PASSWORD,
  database:process.env.MYSQL_DATABASE
})

function query( query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}
module.exports = {
  pool,query
}