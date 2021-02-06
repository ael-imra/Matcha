const data = require('./testData.json')
const mysql = require('../tools/mysql')
require('dotenv').config()
async function insertData() {
  for (let i = 0; i < data.length; i++) {
    await mysql.insert('Users', {
      UserName: data[i].Username,
      Email: data[i].Email,
      FirstName: data[i].FirstName,
      LastName: data[i].LastName,
      Password: data[i].Password,
      DataBirthday: data[i].DataBirthday,
      Latitude: data[i].Location.lat,
      Longitude: data[i].Location.lon,
      City: data[i].City,
      Gender: data[i].Gender,
      Sexual: data[i].Sexual,
      Biography: data[i].Biography,
      Token: data[i].Token,
      ListInterest: JSON.stringify(data[i].ListInterest),
      Images: JSON.stringify(data[i].Images),
      IsActive: 1,
    })
  }
}
insertData().then(() => {
  console.log('Users Is Created!!')
  mysql.pool.end()
})