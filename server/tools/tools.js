const http = require('http')
const https = require('https')

function fetch(url) {
  return new Promise((resolve, reject) =>
    http.get(url, (res) => {
      var body = ''

      res.on('data', function (chunk) {
        body += chunk
      })

      res.on('end', function () {
        var fbResponse = JSON.parse(body)
        resolve(fbResponse)
      })
    })
  )
}

async function fetchDataJSON(country, latitude, longitude) {
  if (!latitude) {
    const res = await fetch(`http://ip-api.com/json/194.170.36.47`)
    return {
      latitude: res.lat,
      longitude: res.lon,
      country: res.city,
    }
  }
  return new Promise((resolve) => {
    resolve({ country, latitude, longitude })
  })
}

function fetchCity(country, url) {
  return new Promise((resolve, reject) => {
    if (country) resolve(country)
    else
      https.get(url, (res) => {
        var body = ''

        res.on('data', function (chunk) {
          body += chunk
        })

        res.on('end', function () {
          var fbResponse = JSON.parse(body)
          resolve(fbResponse.results[0].components.city)
        })
      })
  })
}
async function isEmailOrUserNameNotReadyTake(email, userName, con) {
  const sqlSelect =
    "SELECT COUNT(*) AS 'Count' FROM Users WHERE `Email`=? OR `UserName` =?"
  return new Promise((resolve, reject) =>
    con.query(sqlSelect, [email, userName], (err, result) => {
      if (err) reject(err)
      resolve(result[0].Count !== 0 ? false : true)
    })
  )
}

module.exports = {
  fetch,
  fetchDataJSON,
  fetchCity,
  isEmailOrUserNameNotReadyTake,
}
