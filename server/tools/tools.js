const axios = require('axios')
function init(app,obj){
  for (const [key,value] of Object.entries(obj))
  app.local[key] = value
}
async function fetchDataJSON(country, latitude, longitude,ip) {
  if (!latitude&&ip) {
    const res = await axios.get(`http://ip-api.com/json/${ip}`)
    return {
      latitude: res.data.lat,
      longitude: res.data.lon,
      country: res.data.city,
    }
  }else if (latitude && longitude)
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

async function checkUserInfo(email, userName) {
  const sqlSelect =
    "SELECT COUNT(*) AS 'Count' FROM Users WHERE `Email`=? OR `UserName` =?"
  const result = await query(sqlSelect, [email, userName])
  return (result && result[0].Count !== 0 ? false : true)
}

function sendResponse(res,code,message,json)
{
  res.sendStatus(code);
  if (json)
    res.json(message)
  else
    res.send(message)
  res.end()
}
function checkImage(src){
  return new Promise(resolve=>{
    const newImage = new Image();
    const typeImage = src.search(/data:image\/+/,'')&& src.search(/[;][ -~]+/) ? src.replace(/[data:image/]+/,'').replace(/[;][ -~]+/,'').toLowerCase():null
    const base64Data = src.search(/^[data:image\/]+([jpg]|[png]|[jpeg]|[gif])+[;]/) ? src.replace(/^[data:image\/]+([jpg]|[png]|[jpeg]|[gif])+[;]/,''):null
    if (typeImage&&base64Data)
    {
      newImage.src = src
      newImage.onload = ()=>resolve({typeImage,base64Data})
      newImage.onerror = ()=>resolve({typeImage:null,base64Data:null})
    }
    else
      resolve({typeImage:null,base64Data:null})
  })
}
module.exports = {
  fetchDataJSON,
  checkUserInfo,sendResponse,init,checkImage
}
