const axios = require('axios')
function init(app, obj) {
  for (const [key, value] of Object.entries(obj)) app.locals[key] = value
}
async function fetchDataJSON(country, latitude, longitude, ip) {
  if (!latitude && ip) {
    const res = await axios.get(`http://ip-api.com/json/${ip}`)
    return {
      Latitude: res.data.lat,
      Longitude: res.data.lon,
      City: res.data.city,
    }
  } else if (latitude && longitude)
    return fetchCity(country, latitude, longitude)
  return new Promise((resolve) => {
    resolve({ City: country, Latitude: latitude, Longitude: longitude })
  })
}

function fetchCity(country, Latitude, Longitude) {
  return new Promise(async (resolve) => {
    if (country) resolve(country)
    else {
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=a9a78ca780d3456a9b8bf2b3e790a4b4`
      )
      resolve({
        City: res.data.results[0].components.city,
        Latitude,
        Longitude,
      })
    }
  })
}

function sendResponse(res, code, message, json) {
  res.status(code)
  if (json) res.json(message)
  else res.send(message)
  res.end()
}
function checkImage(src) {
  return new Promise((resolve) => {
    const newImage = new Image()
    const typeImage =
      src.search(/data:image\/+/, '') && src.search(/[;][ -~]+/)
        ? src
            .replace(/[data:image/]+/, '')
            .replace(/[;][ -~]+/, '')
            .toLowerCase()
        : null
    const base64Data = src.search(
      /^[data:image\/]+([jpg]|[png]|[jpeg]|[gif])+[;]/
    )
      ? src.replace(/^[data:image\/]+([jpg]|[png]|[jpeg]|[gif])+[;]/, '')
      : null
    if (typeImage && base64Data) {
      newImage.src = src
      newImage.onload = () => resolve({ typeImage, base64Data })
      newImage.onerror = () => resolve({ typeImage: null, base64Data: null })
    } else resolve({ typeImage: null, base64Data: null })
  })
}
function handleError(err,req,res,next){
  console.log("ERR")
  if (err)
    req.app.locals.sendResponse(res,400,"Bad Request")
  else
    next()
}
async function notification(req,Type,UserOwner,UserReceiver){
  const locals = req.app.locals
  const IdUserOwner = await locals.getIdUserOwner(UserOwner)
  const IdUserReceiver = await locals.getIdUserOwner(UserReceiver)
  let socketOfFriend = null
  if (IdUserOwner && IdUserReceiver)
  {
    const checkSameNotification = await locals.select('Notifications','*',{IdUserOwner,IdUserReceiver,Type})
    if (checkSameNotification.length === 0)
    {
      if (locals.sockets && locals.sockets.length > 0)
        locals.sockets.map(item=>{
          if (item.IdUserOwner === IdUserReceiver)
            socketOfFriend = item
        })
      if (socketOfFriend)
      {
        const result = await locals.insert('Notifications',{IdUserOwner,IdUserReceiver,Type})
        const user = await locals.select('Users',['IdUserOwner','Images','UserName','LastLogin','Active'],{IdUserOwner})
        user[0].Images = JSON.parse(user[0].Images)[0]
        socketOfFriend.emit('notice',JSON.stringify({user:user[0],Type,IdNotification:result.insertId,DateCreation:new Date().toISOString()}))
      }
    }
  }
}
module.exports = {
  fetchDataJSON,
  sendResponse,
  init,
  checkImage,
  notification,
  handleError
}
