const express = require('express')
const mysql = require('mysql')
const router = express.Router()
require('dotenv').config()
function sendQuery(connection, query, params, needed) {
  return new Promise((resolve) => {
    if (needed !== '*' && !params[0]) resolve(null)
    else
      connection.query(query, params, (err, result) => {
        resolve(
          result && result.length !== 0 && !err
            ? needed === '*' || !(result[0] && result[0].hasOwnProperty(needed))
              ? result
              : result[0][needed]
            : null
        )
      })
  })
}
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})
router.get('/:usernameOwner', (req, res) => {
  pool.getConnection(async (ConnectionError, connection) => {
    if (ConnectionError) {
      res.send('connection Error')
      res.end()
    } else {
      const idUserOwner = await sendQuery(
        connection,
        'SELECT IdUserOwner FROM Users WHERE `UserName`=?',
        [req.params.usernameOwner],
        'IdUserOwner'
      )
      const ratingValue = await sendQuery(
        connection,
        'SELECT SUM(RatingValue)/Count(*) AS "AVG" From Rating WHERE `IdUserReceiver`=?',
        [idUserOwner],
        'AVG'
      )
      res.send(ratingValue ? ratingValue.toString() : '0')
      connection.release()
      res.end()
    }
  })
})
router.post('/', (req, res) => {
  if (
    req.body.usernameReceiver &&
    req.body.RatingValue &&
    req.body.RatingValue >= 0 &&
    req.body.RatingValue <= 5
  ) {
    pool.getConnection(async (err, connection) => {
      if (err) res.send('Error on Connection')
      const idUserOwner = await sendQuery(
        connection,
        'SELECT IdUserOwner FROM `Rating` WHERE `IdUserOwner`=?',
        ['jnbsiqyefq.uhjwpmqnim'],
        'IdUserOwner'
      )
      if (idUserOwner) {
        const result = await sendQuery(
          connection,
          'UPDATE Rating SET `RatingValue`=? WHERE `IdUserOwner`=?',
          [req.body.RatingValue, idUserOwner],
          '*'
        )
        res.send(result ? 'Update Seccuss' : 'Error Update Rating')
        connection.release()
        res.end()
      } else {
        const owner = await sendQuery(
          connection,
          'SELECT `IdUserOwner` FROM Users WHERE `UserName`=?',
          ['jnbsiqyefq.uhjwpmqnim'],
          'IdUserOwner'
        )
        const receiver = await sendQuery(
          connection,
          'SELECT `IdUserOwner` FROM Users WHERE `UserName`=?',
          req.body.usernameReceiver,
          'IdUserOwner'
        )
        const result = await sendQuery(
          connection,
          'INSERT INTO Rating(`IdUserOwner`,`IdUserReceiver`,`RatingValue`) VALUES (?,?,?)',
          [owner, receiver, req.body.RatingValue],
          '*'
        )
        const avg = await sendQuery(
          connection,
          'SELECT SUM(RatingValue)/Count(*) AS "AVG" From Rating WHERE `IdUserReceiver`=?',
          [receiver],
          'AVG'
        )
        res.send(avg ? avg.toString() : 'Error')
        connection.release()
        res.end()
      }
    })
  } else res.send('error')
})
module.exports = router
