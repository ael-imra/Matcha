const express = require('express')
const mysql = require('mysql')
const router = express.Router()
function sendQuery(connection, query, params, needed) {
  return new Promise((resolve) => {
    if (needed !== '*' && !params[0]) resolve(null)
    else
      connection.query(query, params, (err, result) => {
        resolve(
          result.length!==0
            ? needed === '*' || !(result[0] && result[0].hasOwnProperty(needed))
              ? result
              : result[0][needed]
            : null
        )
      })
  })
}
const Pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Test12345@',
  database: 'Matcha',
})
router.get('/:usernameOwner', (req, res) => {
  Pool.getConnection(async (ConnectionError, connection) => {
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
        'SELECT RatingValue FROM `Rating` WHERE `IdUserReceiver`=?',
        [idUserOwner],
        'RatingValue'
      )
      res.send(ratingValue ? ratingValue : '0')
      res.end()
    }
  })
})
router.post('/', (req, res) => {
  if (
    req.body.usernameOwner &&
    req.body.usernameReceiver &&
    req.body.RatingValue
  ) {
    Pool.getConnection((err, connection) => {
      if (err) res.send('Error on Connection')
      sendQuery(connection, 'SELECT * FROM `Rating` WHERE `IdUserOwner`=?', [
        req.body.usernameOwner,
      ])
        .then((IdUserOwnerResult) => {
          connection.query(
            'UPDATE Rating SET `RatingValue`=? WHERE `IdUserOwner`=?',
            [req.body.RatingValue, IdUserOwnerResult[0].IdUserOwner],
            (updateError) => {
              if (updateError) res.send('Error Update Rating')
              else res.send('Update Seccuss')
            }
          )
        })
        .catch(() => {
          connection.query(
            'SELECT `IdUserOwner` FROM Users WHERE `UserName`=?',
            [req.body.usernameOwner],
            (IdUserOwnerError, IdUserOwnerResult) => {
              if (IdUserOwnerError) res.send('Error IdUserOwner')
              else
                connection.query(
                  'SELECT `IdUserOwner` FROM Users WHERE `UserName`=?',
                  [req.body.usernameReceiver],
                  (IdUserReceiverError, IdUserReceiverResult) => {
                    if (IdUserReceiverError) res.send('Error IdUserReceiver')
                    else
                      connection.query(
                        'INSERT INTO Rating(`IdUserOwner`,`IdUserReceiver`,`RatingValue`) VALUES (?,?,?)',
                        [
                          IdUserOwnerResult[0].IdUserOwner,
                          IdUserReceiverResult[0].IdUserOwner,
                          req.body.RatingValue,
                        ],
                        (insetError) => {
                          if (insetError) res.send('Error Insert')
                          else res.send(req.body.RatingValue.toString())
                          res.end()
                        }
                      )
                    res.end()
                  }
                )
              res.end()
            }
          )
        })
    })
  } else res.send('error')
})
module.exports = router
