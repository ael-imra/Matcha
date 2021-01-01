const express = require('express')
const router = express.Router()
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const Validate = require('../tools/validate')
require('dotenv').config({path:'../.env'})

async function auth(req, res, next) {
  const authorization = req.headers['authorization']
  if (authorization) {
    if (authorization.split(' ').length > 1)
    {
      jwt.verify(authorization.split(' ')[1], process.env.JWT_KEY, async (err, user) => {
        if (user) {
          req.userInfo = user
          next()
        } 
        else if (err.message === 'jwt expired') 
        req.app.sendResponse(res,401,'Access token expired')
        else
          req.app.sendResponse(res,401,'User not authenticated')
      })
    }
    else
      req.app.sendResponse(res,400,'token invalid')
  } else {
    req.app.sendResponse(res,400,'token not found')
  }
}
router.get('/logout', auth, function (req, res) {
  jwt.destroy(user)
})
router.post('/login', async function (req, res) {
  if (
    Validate('Email', req.body.email) &&
    Validate('Password', req.body.password)
  ) {
    const sqlSelect = 'SELECT * FROM Users WHERE `Email` = ? AND `Password` = ?'
    const result = await req.app.query(sqlSelect,[req.body.email, md5(req.body.password)])
    if (result.length !== 0)
    {
    const data = result[0]
      if (data.IsActive === 1) {
        let accessToken = jwt.sign({ data }, process.env.JWT_KEY)
        res.json({
          accessToken,
          data,
        })
      } else req.app.sendResponse(res,200,'account is not active')
    }else req.app.sendResponse(res,400,'User Not Found')
  } else req.app.sendResponse(res,400,'bad user information')
})
router.post('/insert', function (req, res) {
  if (
    Validate('Email', req.body.email) &&
    Validate('Password', req.body.password) &&
    Validate('Username', req.body.useName) &&
    Validate('Name', req.body.lastName) &&
    Validate('Name', req.body.firstName)
  ) {
    const result = await req.app.checkUserInfo(req.body.email, req.body.useName, pool)
      if (result === true) {
        const userInfo = [req.body.useName,req.body.email,req.body.firstName,req.body.lastName,md5(req.body.password),req.app.crypto.randomBytes(64).toString('hex'),0]
        const sqlInsert =
          'INSERT INTO Users (`UserName`, `Email`,`FirstName`,`LastName`,`Password`,`DataBirthday`,`Token`,`IsActive`) VALUES (?,?,?,?,?,?,?,?)'
        const resultInsert = await req.app.query(sqlInsert,[userInfo])
        if (resultInsert)
        {
          req.app.sendActivation(req.body.email,userInfo[0],userInfo[5])
          req.app.sendResponse(res,200,'successful')
        }else req.app.sendResponse(res,403,'Error')
      } else req.app.sendResponse(res,400,'user information already taken')
  } else req.app.sendResponse(res,400,'bad user information')
})
router.post('/completeInsert', function (req, res) {
  const {step1,step2,step3,step4,step5} = req.body
  if (step1,step2,step3,step4,step5)
  {
    const imageList = []
    let imageCheck = true
    step5.forEach((image) => {
      const {typeImage,base64Data} = await req.app.checkImage(image.src)
      if (typeImage,base64Data)
      {
        const nameImage = req.app.crypto.randomBytes(16).toString('hex')
        const url = `http://localhost:${process.env.PORT}/images/${nameImage}.${typeImage}`
        imageList[0] = image.default === 1 ? url : imageList[0]
        image.default !== 1 ? imageList.push(url) : null
        require('fs').writeFile(`images/${nameImage}.${typeImage}`,base64Data,'base64',(err) => imageCheck = err ? false:true)
      }
      else
        imageCheck = false
    })
    if (imageCheck) {
      const dateOfBirth = step1
      const biography = step4.DescribeYourself
      const gender = step3.youGender
      const Sexual = step3.genderYouAreLooking.toString().replace(',',' ').trim()
      const obj = await req.app.fetchDataJSON(step2.country,step2.latitude,step2.longitude,'194.170.36.47')
      const {latitude,longitude,city} = obj.latitude
      const images = JSON.stringify(imageList)
      const token = req.body.token
      const listInterest = JSON.stringify(step4.yourInterest)
      const completeInsert =
        'UPDATE `Users` SET `DataBirthday`=? , `City` = ?,`Gender` = ?,`Sexual`=?,`Biography`=?,`Images`=?,`Latitude`=?,`Longitude`=?,`ListInterest`=? WHERE `Token` = ?'
      const result = await req.app.query(completeInsert,[dateOfBirth,city,gender,Sexual,biography,images,latitude,longitude,listInterest,token,])
      if(result)
        res.app.sendResponse(res,200,'successful')
      else 
        req.app.sendResponse(res,403,"Something wrong With your images")
    } 
    else 
      req.app.sendResponse(res,403,"Something wrong With your images")
  }
  else
    req.app.sendResponse(res,400,"bad user information")
})

module.exports = router