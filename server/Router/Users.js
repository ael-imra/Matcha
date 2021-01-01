const express = require('express')
const mysql = require('mysql')
const router = express.Router()
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})
// router.get('/', function (req, res) {
//   const sqlSelect = 'SELECT * FROM Users'
//   pool.query(sqlSelect, (err, result) => {
//     if (err) res.send('Error')
//     else res.send(result)
//   })
// })
router.post('/', async function (req, res) {
    const result = await query(pool,
      'SELECT `Latitude`,`Longitude` FROM `Users` WHERE `Email`=?',
      ['eebuxwribz.tvpdjkgihu@gmail.com']
    )
    if (result.length!== 0 && result[0].Latitude && result.Longitude)
    {
      const {Latitude,Longitude} = result[0]
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
        const filterResult = await query(pool,query,
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
          ]
        )
        if (filterResult){
            res.json(filterResult)
            res.end()
        }
        else
        {
          res.sendStatus(400)
          res.end()
        }
    }
    else{
      res.sendStatus(404)
      res.end()
    }
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
    pool.query(
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

module.exports = router
