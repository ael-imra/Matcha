const https = require('https')
require('dotenv').config()
function findLatLonByCity(city) {
  const obj = {
    lat: null,
    lon: null,
  }
  let data = ''
  return new Promise((resolve, reject) => {
    https.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.opencagedata_API_KEY}`,
      (res) => {
        res.on('data', function (chunk) {
          data += chunk
        })
        res.on('end', () => {
          if (
            JSON.parse(data) &&
            JSON.parse(data).results[0] &&
            JSON.parse(data).results[0].bounds &&
            (JSON.parse(data).results[0].bounds.northeast ||
              JSON.parse(data).results[0].bounds.southwest)
          ) {
            obj.lat =
              JSON.parse(data).results[0].bounds.northeast.lat ||
              JSON.parse(data).results[0].bounds.southwest.lat
            obj.lon =
              JSON.parse(data).results[0].bounds.northeast.lng ||
              JSON.parse(data).results[0].bounds.northeast.lat
          }
          resolve(obj)
        })
      }
    )
  })
}
function getDistance(lat1, lon1, lat2, lon2) {
  var R = 6371
  var dLat = lat2 - lat1 * (Math.PI / 180)
  var dLon = lon2 - lon1 * (Math.PI / 180)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c
  return d
}
module.exports = findLatLonByCity
