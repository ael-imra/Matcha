const axios = require('axios')

async function fetchDataJSON(country, latitude, longitude) {
  if (!latitude) {
    const res = await axios.get("http://ip-api.com/json/194.170.36.47")
    return {
      latitude: res.data.lat,
      longitude: res.data.lon,
      country: res.data.city,
    }
  }else if (latitude&&longitude)
    return fetchCity(country,latitude,longitude)
  return new Promise((resolve) => {
    resolve({ country, latitude, longitude })
  })
}

function fetchCity(country, latitude,longitude) {
  return new Promise(async (resolve) => {
    if (country) resolve(country)
    else
    {
      const res = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=a9a78ca780d3456a9b8bf2b3e790a4b4`)
      resolve({city:res.data.results[0].components.city,latitude,longitude,})
    }
  })
}

fetchDataJSON(null,32.8811,-6.9063).then(data=>console.log(data))