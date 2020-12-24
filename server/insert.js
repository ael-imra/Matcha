const mysql = require('mysql')
const data = require('./testData.json')
require('dotenv').config()
const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true,
})
connection.getConnection((error, con) => {
  if (error) console.log(error)
  for (let i = 0; i < data.length; i++) {
    con.query(
      'INSERT INTO Users(`UserName`,`Email`,`FirstName`,`LastName`,`Password`,`DataBirthday`,`Latitude`,`Longitude`,`City`,`Gender`,`Sexual`,`Biography`,`Token`,`ListInterest`,`Images`,`IsActive`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        data[i].Username,
        data[i].Email,
        data[i].FirstName,
        data[i].LastName,
        data[i].Password,
        data[i].DataBirthday,
        data[i].Location.lat,
        data[i].Location.lon,
        data[i].City,
        data[i].Gender,
        data[i].Sexual,
        data[i].Biography,
        data[i].Token,
        JSON.stringify(data[i].ListInterest),
        JSON.stringify(data[i].Images),
        1,
      ],
      (err) => {
        if (err) console.log(err)
        con.release()
      }
    )
    if (i === data.length - 1) connection.end()
  }
})
