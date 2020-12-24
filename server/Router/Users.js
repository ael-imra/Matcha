const express = require('express')
const mysql = require('mysql')
const router = express.Router()
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const {
  isEmailOrUserNameNotReadyTake,
  fetchDataJSON,
  fetchCity,
} = require('../tools/tools')

const md5 = require('md5')
const jwt = require('jsonwebtoken')
const Validate = require('../tools/validate')
let con = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Test12345@',
  database: 'Matcha',
})
const Pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Test12345@',
  database: 'Matcha',
})
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'camagru1337aelimra@gmail.com',
    pass: 'ael-imra@1337',
  },
})
function sendQuery(connection, query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}
async function auth(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    let token = req.headers['authorization']
    token = token.split(' ')[1]
    jwt.verify(token, 'access', async (err, user) => {
      if (user) {
        req.user = user
        next()
      } else if (err.message === 'jwt expired') {
        return res.send('Access token expired')
      } else {
        return res.send('User not authenticated')
      }
    })
  } else {
    return res.send('Refresh token not found, login again')
  }
}
router.get('/', function (req, res) {
  const sqlSelect = 'SELECT * FROM Users'
  con.query(sqlSelect, (err, result) => {
    if (err) res.send('Error')
    else res.send(result)
  })
})
router.get('/logout', auth, function (req, res) {
  jwt.destroy(user)
})
router.post('/', function (req, res) {
  Pool.getConnection((err, connection) => {
    if (err) res.json(err)
    sendQuery(
      connection,
      'SELECT `Latitude`,`Longitude` FROM `Users` WHERE `Email`=?',
      ['eebuxwribz.tvpdjkgihu@gmail.com']
    )
      .then(([{ Latitude, Longitude }]) => {
        let listInterest = '`ListInterest` LIKE ?'
        req.body.list.map((value) => {
          listInterest + ' AND `ListInterest` LIKE ?'
          return '%' + value + '%'
        })
        req.body.list.length === 0 ? req.body.list.push('%%') : req.body.list
        const avg = 0.0075 * req.body.location[1]
        const startDate = new Date(
          Date.now() - 31536 * 10 ** 6 * req.body.age[0]
        )
          .toJSON()
          .replace(/[T][ -~]+/, '')
        const endDate = new Date(Date.now() - 31536 * 10 ** 6 * req.body.age[1])
          .toJSON()
          .replace(/[T][ -~]+/, '')
        const query =
          'SELECT * FROM `Users` WHERE Username != ? AND `UserName` LIKE ? AND ' +
          listInterest +
          ' AND `DataBirthday` <= ? AND `DataBirthday` >= ? AND `Latitude`>= ? AND `Latitude`<= ? AND `Longitude` >= ? AND `Longitude` <= ? LIMIT ?,24'
        connection.query(
          query,
          [
            'jnbsiqyefq.uhjwpmqnim',
            '%' + req.body.name + '%',
            ...req.body.list,
            startDate,
            endDate,
            req.body.location[1] === 1000 ? -85 : parseFloat(Latitude - avg),
            req.body.location[1] === 1000 ? 85 : parseFloat(Latitude + avg),
            req.body.location[1] === 1000 ? -180 : parseFloat(Longitude - avg),
            req.body.location[1] === 1000 ? 180 : parseFloat(Longitude + avg),
            req.body.start,
          ],
          (err, result) => {
            if (err) res.send(err)
            else res.send(result)
            connection.release()
            res.end()
          }
        )
      })
      .catch((err) => console.log(err))
  })
})

router.post('/login', function (req, res) {
  if (
    typeof req.body.email !== 'undefined' &&
    typeof req.body.password !== 'undefined' &&
    req.body.email !== '' &&
    req.body.password !== '' &&
    Validate('Email', req.body.email) &&
    Validate('Password', req.body.password)
  ) {
    const sqlSelect = 'SELECT * FROM Users WHERE `Email` = ? AND `Password` = ?'
    con.query(
      sqlSelect,
      [req.body.email, md5(req.body.password)],
      (err, result) => {
        let data = result[0]
        if (err) res.send(err)
        else {
          if (data) {
            if (data.IsActive === 1) {
              let accessToken = jwt.sign({ data }, 'access')
              res.json({
                accessToken,
                data,
              })
            } else res.send('account is not active')
          } else res.send('account not found')
        }
      }
    )
  } else res.send('ops ...')
})
router.post('/user', auth, function (req, res) {
  if (
    typeof req.user.data.Email !== 'undefined' &&
    typeof req.user.data.Password !== 'undefined' &&
    req.user.data.Email !== '' &&
    req.user.data.Password !== ''
  ) {
    const sqlSelect =
      'SELECT * FROM Users WHERE `Email` = ? AND `Password` = ? AND `IsActive` = 1'
    con.query(
      sqlSelect,
      [req.user.data.Email, req.user.data.Password],
      (err, result) => {
        if (err) res.send(err)
        else {
          res.send(result)
        }
      }
    )
  } else res.send('ops ...')
})

router.post('/insert', function (req, res) {
  if (
    typeof req.body.email !== 'undefined' &&
    typeof req.body.password !== 'undefined' &&
    typeof req.body.useName !== 'undefined' &&
    typeof req.body.lastName !== 'undefined' &&
    typeof req.body.firstName !== 'undefined' &&
    req.body.email !== '' &&
    req.body.password !== '' &&
    req.body.useName !== '' &&
    req.body.lastName !== '' &&
    req.body.firstName !== '' &&
    Validate('Email', req.body.email) &&
    Validate('Password', req.body.password) &&
    Validate('Username', req.body.useName) &&
    Validate('Name', req.body.lastName) &&
    Validate('Name', req.body.firstName)
  ) {
    isEmailOrUserNameNotReadyTake(req.body.email, req.body.useName, con).then(
      (result) => {
        if (result === true) {
          const useName = req.body.useName
          const lastName = req.body.lastName
          const firstName = req.body.firstName
          const password = md5(req.body.password)
          const email = req.body.email
          const dateOfBirth = '1997-02-14'
          const city = 'xxx'
          const biography = 'x'
          const gender = 'x'
          const Location = 'x'
          const Sexual = 'x'
          const ListInterest = 'x'
          const Images = 'x'
          const token = crypto.randomBytes(64).toString('hex')
          const isActive = 0
          const sqlInsert =
            'INSERT INTO Users (`UserName`, `Email`,`FirstName`,`LastName`,`Password`,`DataBirthday`,`Latitude`,`Longitude`,`City`,`Gender`,`Sexual`,`Biography`,`Token`,`IsActive`,`ListInterest`,`Images`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
          con.query(
            sqlInsert,
            [
              useName,
              email,
              firstName,
              lastName,
              password,
              dateOfBirth,
              Location,
              Location,
              city,
              gender,
              Sexual,
              biography,
              token,
              isActive,
              ListInterest,
              Images,
            ],
            (err, result) => {
              if (err) res.send(err)
              else {
                const mailOptions = {
                  from: 'camagru1337aelimra@gmail.com',
                  to: req.body.email,
                  subject: 'Activate your email address',
                  html: `<div>
              <p>Hey ${useName} </p>
              <p>thanks for signing up for Matcha</p>
              <p>please <a href="http://localhost:5000/user/active?token=${token}"> Click here</a> to Activate your email address</p>
              </div>`,
                }
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error)
                  } else {
                    console.log('Email sent: ' + info.response)
                  }
                })
                res.send('successful')
              }
            }
          )
        } else res.send('ops ...')
      }
    )
  } else res.send('ops ...')
})

router.post('/completeInsert', function (req, res) {
  let imageList = new Array(['default'])
  let nameImage = ''
  let typeImage = ''
  let base64Data
  let imageCheck = true
  req.body.step5.forEach((image) => {
    if (
      image.src.split('data:image/').length == 2 &&
      image.src.split('data:image/')[1].split(';').length == 2
    ) {
      typeImage = image.src.split('data:image/')[1].split(';')[0]
      nameImage = crypto.randomBytes(16).toString('hex')
      if (image.default == 1)
        imageList[0] = `http://localhost:5000/images/${nameImage}.${typeImage}`
      else
        imageList.push(`http://localhost:5000/images/${nameImage}.${typeImage}`)
      base64Data = image.src.replace(`data:image/${typeImage};base64,`, '')
      require('fs').writeFile(
        `images/${nameImage}.${typeImage}`,
        base64Data,
        'base64',
        function (err) {
          if (err) imageCheck = false
        }
      )
    } else res.send('Image Error')
  })
  if (imageCheck) {
    const dateOfBirth = req.body.step1
    const biography = req.body.step4.DescribeYourself
    const gender = req.body.step3.youGender
    let Sexual = ''
    req.body.step3.genderYouAreLooking.forEach((element) => {
      Sexual = Sexual + ' ' + element
    })
    fetchDataJSON(
      req.body.step2.country,
      req.body.step2.latitude,
      req.body.step2.longitude
    ).then((obj) => {
      fetchCity(
        obj.country,
        `https://api.opencagedata.com/geocode/v1/json?q=${obj.latitude}+${obj.longitude}&key=a9a78ca780d3456a9b8bf2b3e790a4b4`
      ).then((city) => {
        const latitude = obj.latitude
        const longitude = obj.longitude
        const images = JSON.stringify(imageList)
        const token = req.body.token
        const listInterest = JSON.stringify(req.body.step4.yourInterest)
        const completeInsert =
          'UPDATE `Users` SET `DataBirthday`=? , `City` = ?,`Gender` = ?,`Sexual`=?,`Biography`=?,`Images`=?,`Latitude`=?,`Longitude`=?,`ListInterest`=? WHERE `Token` = ?'
        con.query(
          completeInsert,
          [
            dateOfBirth,
            city,
            gender,
            Sexual,
            biography,
            images,
            latitude,
            longitude,
            listInterest,
            token,
          ],
          (err) => {
            if (err) res.send('Error')
            else {
              res.send('successful')
            }
          }
        )
      })
    })
  } else res.send('Error')
})

module.exports = router
