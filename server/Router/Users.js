const express = require('express')
const router = express.Router()
const Validate = require('../tools/validate')
const md5 = require('md5')
const {auth} = require('./Authentication')
require('dotenv').config({
  path: __dirname + '/../.env',
})

// router.post('/user',auth,(req,res)=>{
//   res.app.locals.sendResponse(res,200,res.userInfo,true)
// })
router.post('/',auth, async function (req, res) {
  console.log(req.userInfo)
  const { Latitude, Longitude } = req.userInfo
  const { list, age, name, location,rating, start,length } = req.body
  const avg = 0.0075 * location[1]
  const locals = req.app.locals
  const filterResult = await locals.filter({
    IdUserOwner:req.userInfo.IdUserOwner,
    name,
    list,
    age,
    location:[
      location[1] === 1000 ? -85 : parseFloat(Latitude - avg),
      location[1] === 1000 ? 85 : parseFloat(Latitude + avg),
      location[1] === 1000 ? -180 : parseFloat(Longitude - avg),
      location[1] === 1000 ? 180 : parseFloat(Longitude + avg),
    ],
    rating,
    start,
    length
  })
  if (filterResult) locals.sendResponse(res, 200, filterResult, true)
  else locals.sendResponse(res, 400, 'someting wrong with your data')
})

router.post('/CheckActive', async function (req, res) {
  const {Email,Password} = req.body
  const locals = req.app.locals
  if (Email && Password) {
    const result = await locals.select('Users','*',{Email,Password,IsActive:1})
    if (result && result.length > 0)
      locals.sendResponse(res,200,result,true)
    else
      locals.sendResponse(res,400,"User Not Found")
  } else 
      locals.sendResponse(res,400,"Bad Request")
})

router.post('/ForgatPassword', async function (req, res) {
  const {Email} = req.body
  const locals = req.app.locals
  if (Validate('Email', Email)) {
    const result = await locals.select('Users','*',{Email})
    if (result && result.length !== 0) {
      locals.sendMail('create new password your email address','to create new password',Email, result[0].UserName,`${process.env.CLIENT_PROTOCOL}://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/ForgatPassword/?token=${result[0].Token}`)
      locals.sendResponse(res,200,result[0].Email)
    } else locals.sendResponse(res,400,'Email not Found')
  }else
    locals.sendResponse(res,400,'Bad Request')
})

router.get('/Active', async function (req, res) {
  const Token = req.query.token
  const locals = req.app.locals
  if (Token) {
    const result = await locals.select('Users',"COUNT(*) AS 'Count'",{Token})
    if (result && result.length > 0 && result[0].Count === 1)
    {
      locals.update('Users',{IsActive:1,Token:locals.crypto.randomBytes(64).toString('hex')},{Token})
      locals.sendResponse(res,200,'Account Now is Active')
    }
    else
      locals.sendResponse(res,400,'Account Not Found')
  }
    else
      locals.sendResponse(res,400,'Account Not Found')
})

router.post('/ResetPassword', async function (req, res) {
  const {Token,Password,Confirm} = req.body
  const locals = req.app.locals
  if (Token && Validate('Password', Confirm) && Password === Confirm ) {
    const result = await locals.select('Users',"COUNT(*) AS 'Count'",{Token})
    if (result && result.length > 0 && result[0].Count === 1)
    {
      const resultUpdate = await locals.update('Users',{Password:md5(Password),Token:locals.crypto.randomBytes(64).toString('hex'),JWT:null},{Token})
      if (resultUpdate)
        locals.sendResponse(res,200,'Account is Active')
      else
        locals.sendResponse(res,403,'Error on Update Password')
    } else locals.sendResponse(res,400,'account not found')
  }
  else locals.sendResponse(res,400,'Bad Request')
})

module.exports = router
