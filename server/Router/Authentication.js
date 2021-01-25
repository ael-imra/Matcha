const express = require('express')
const router = express.Router()
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const Validate = require('../tools/validate')
require('dotenv').config({ path: __dirname+'/../.env' })

async function auth(req, res, next) {
  const authorization = req.headers['authorization']
  const locals = req.app.locals
  if (authorization) {
    if (authorization.split(' ').length > 1) {
      const result = await locals.select('Users','*',{JWT:authorization.split(' ')[1]})
      if (result.length > 0)
        jwt.verify(
          authorization.split(' ')[1],
          process.env.JWT_KEY,
          async (err, payload) => {
            if (payload) {
              req.userInfo = result[0]
              next()
            } else if (err.message === 'jwt expired')
              locals.sendResponse(res, 401, 'Access token expired')
            else locals.sendResponse(res, 401, 'User not authenticated')
          }
        )
      else locals.sendResponse(res, 401, 'User not authenticated')
    } else locals.sendResponse(res, 400, 'token invalid')
  } else {
    locals.sendResponse(res, 400, 'token not found')
  }
}
router.get('/Logout',auth, function (req, res) {
  if (req.userInfo)
  {
    req.app.locals.update('Users',{JWT:null},{JWT:req.userInfo.JWT})
    req.app.locals.sendResponse(res,200,"You're now logout")
  }
  else
    req.app.locals.sendResponse(res,403,'Something wrong please try again')
})
router.post('/Login', async function (req, res) {
  const locals = req.app.locals
  const { Email, Password } = req.body
  if (Validate('Email', Email) && Validate('Password', Password)) {
    const result = await locals.select('Users',['IdUserOwner','UserName','Email','IsActive','JWT'], {
      Email,
      Password: md5(Password),
    })
    if (result.length !== 0) {
      const data = result[0]
      if (data.JWT)
        locals.sendResponse(res,200,{accessToken:data.JWT,data},true)
      else
      {
        if (data.IsActive === 1) {
          const accessToken = jwt.sign({ data }, process.env.JWT_KEY)
          const resultUpdateJWT = await locals.update('Users',{JWT:accessToken},{IdUserOwner:data.IdUserOwner})
          if (resultUpdateJWT)
            locals.sendResponse(res,200,{accessToken,data},true)
          else locals.sendResponse(res,403,"Something wrong please try again")
        } else locals.sendResponse(res, 200, 'account is not active')
      }
    } else locals.sendResponse(res, 400, 'User Not Found')
  } else locals.sendResponse(res, 400, 'bad user information')
})
router.post('/Insert', async function (req, res) {
  const { UserName, Email, FirstName, LastName, Password } = req.body
  const locals = req.app.locals
  if (
    Validate('Email', Email) &&
    Validate('Password', Password) &&
    Validate('Username', UserName) &&
    Validate('Name', LastName) &&
    Validate('Name', FirstName)
  ) {
    const result = await locals.checkUserExist({ Email, UserName })
    if (result === true) {
      const userInfo = {
        UserName,
        Email,
        FirstName,
        LastName,
        Password: md5(Password),
        Token: locals.crypto.randomBytes(64).toString('hex'),
        IsActive:0,
      }
      const resultInsert = await locals.insert('Users', userInfo)
      if (resultInsert) {
        locals.sendMail('Activate your email address','to Activate your email address',req.body.email, userInfo.UserName,`${process.env.CLIENT_PROTOCOL}://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/Users/Active/?token=${userInfo.Token}`)
        locals.sendResponse(res, 200, 'successful')
      } else locals.sendResponse(res, 403, 'Error')
    } else locals.sendResponse(res, 400, 'user information already taken')
  } else locals.sendResponse(res, 400, 'bad user information')
})
router.post('/CompleteInsert', async function (req, res) {
  const { step1, step2, step3, step4, step5 } = req.body
  const locals = req.app.locals
  if ((step1, step2, step3, step4, step5)) {
    const imageList = []
    let imageCheck = true
    step5.forEach(async (image) => {
      const { typeImage, base64Data } = await locals.checkImage(image.src)
      if ((typeImage, base64Data)) {
        const nameImage = locals.crypto.randomBytes(16).toString('hex')
        const url = `http://localhost:${process.env.PORT}/images/${nameImage}.${typeImage}`
        imageList[0] = image.default === 1 ? url : imageList[0]
        image.default !== 1 ? imageList.push(url) : null
        require('fs').writeFile(
          `images/${nameImage}.${typeImage}`,
          base64Data,
          'base64',
          (err) => (imageCheck = err ? false : true)
        )
      } else imageCheck = false
    })
    if (imageCheck) {
      const obj = await locals.fetchDataJSON(
        step2.country,
        step2.latitude,
        step2.longitude,
        '194.170.36.47'
      )
      const values = {
        DataBirthday: step1,
        Biography: step4.DescribeYourself,
        Gender: step3.youGender,
        Sexual: step3.genderYouAreLooking.toString().replace(',', ' ').trim(),
        Images: JSON.stringify(imageList),
        ListInterest: JSON.stringify(step4.yourInterest),
        ...obj,
      }
      const needed = {
        Token: req.body.token,
      }
      const result = await locals.update('Users', values, needed)
      if (result) res.app.sendResponse(res, 200, 'successful')
      else locals.sendResponse(res, 403, 'Something wrong With your images')
    } else locals.sendResponse(res, 403, 'Something wrong With your images')
  } else locals.sendResponse(res, 400, 'bad user information')
})

module.exports = {Authentication:router,auth}
