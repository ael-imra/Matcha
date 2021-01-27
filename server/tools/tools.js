const axios = require('axios')
const Jimp = require('jimp')
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
function checkImage(src, locals) {
  return new Promise((resolve) => {
    if (src && src !== '') {
      const base64Data = src.split(',');
      if (base64Data.length > 1) {
        const nameImage = locals.crypto.randomBytes(16).toString('hex');
        const url = `http://localhost:${process.env.PORT}/images/${nameImage}.jpg`;
        const buffer = Buffer.from(base64Data[1], 'base64');
        Jimp.read(buffer, (err, res) => {
          if (err) resolve(null);
          else {
            res.quality(40).write(`./images/${nameImage}.jpg`);
            resolve(url);
          }
        });
      } else resolve(null);
    } else resolve(null);
  });
}
function checkImages(images) {
 return new Promise((resolve) => {
    let arr = [];
    if (images.length > 0)
      images.forEach((image) => {
        let base64Data = image.split(',');
        if (base64Data.length > 1) {
          const buffer = Buffer.from(base64Data[1], 'base64');
          Jimp.read(buffer, (err, res) => {
            if (err) {
              resolve(false);
            } else {
              arr.push('ok');
            }
            if (arr.length === images.length) resolve(true);
          });
        } else resolve(false);
      });
    else resolve(false);
  });
}
function handleError(err,req,res,next){
  if (err)
  {
    console.log("ERRR")
    req.app.locals.sendResponse(res,400,"Bad Request")
  }
  else
    next()
}
let checkProfileOfYou = (token, UserName, locals) => {
  return new Promise(async (resolve) => {
    if (token && UserName && locals && token !== '' && UserName !== '') {
      const result = await locals.select('Users', ['UserName'], {
        Token: token,
        IsActive: 1,
      });
      if (result[0]) {
        if (result[0].UserName === UserName) resolve(true);
        else resolve(false);
      } else resolve(false);
    } else resolve(false);
  });
};
function handleError(err, req, res, next) {
  if (err) req.app.locals.sendResponse(res, 400, 'Bad Request');
  else next();
}
let getImage = (token, locals) => {
  return new Promise(async (resolve) => {
    if (token && locals && token != '') {
      const result = await locals.select('Users', ['Images'], {
        Token: token,
        IsActive: 1,
      });
      if (result[0]) resolve(result);
      else resolve(false);
    } else resolve(false);
  });
};

let getPassword = (token, locals) => {
  return new Promise(async (resolve, reject) => {
    if (token && locals && token != '') {
      const result = await locals.select('Users', ['Password'], {
        Token: token,
        IsActive: 1,
      });
      if (result[0]) resolve(result);
      else resolve(false);
    } else resolve(false);
  });
};
function getImageProfile(users) {
  return new Promise((resolve) => {
    let Array = [];
    users.forEach((user) => {
      user.Images = JSON.parse(user.Images)[0];
      Array.push('ok');
      if (Array.length === users.length) 
        resolve('ok');
    });
    if (Array.length === users.length) 
     resolve('ok');
  });
}
function ifNotBlock(IdUserOwner, IdUserReceiver, locals) {
  return new Promise(async (resolve) => {
    const result1 = await locals.select('Blacklist', '*', {
      IdUserOwner: IdUserOwner,
      IdUserReceiver: IdUserReceiver,
    });
    const result2 = await locals.select('Blacklist', '*', {
      IdUserOwner: IdUserReceiver,
      IdUserReceiver: IdUserOwner,
    });
    if (!result1[0] && !result2[0]) resolve(true);
    else resolve(false);
  });
}
function verifyIdTokenGoogle(id) {
  return new Promise(async (resolve) => {
    try {
      const ticket = await client.verifyIdToken({
        idToken: id,
        audience: '652872186498-sdfbthmnqp8tqnlnpmu3rsiv2v8rb8s5.apps.googleusercontent.com', // Specify the CLIENT_ID
      });
      const payload = ticket.getPayload();
      const userEmail = payload;
      resolve(userEmail.email);
    } catch (error) {
      resolve(false);
    }
  });
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
  checkImages,
  notification,
  handleError,
  checkProfileOfYou,
  getImage,
  getPassword,
  getImageProfile,
  ifNotBlock,
  verifyIdTokenGoogle,
}
