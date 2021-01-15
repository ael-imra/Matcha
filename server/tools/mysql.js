const mysql_object = require('mysql');
require('dotenv').config({
  path: __dirname + '/../.env',
})
const mysql = {}
mysql.pool = mysql_object.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})
function parseValue(values)
{
  let parse = '';
  let i = 0
  if (values)
  {
    for (const [key,value] of Object.entries(values))
    {
      if (i < Object.keys(values).length - 1)
        parse += key+"="+mysql.pool.escape(value) + " AND "
      else
        parse += key+"="+mysql.pool.escape(value)
      i++;
    }
  }
  return (parse !== '' ? parse : '1')
}
mysql.query = function (query, params) {
  return new Promise((resolve, reject) => {
    mysql.pool.getConnection((error,connection)=>{
      if (error) console.log(error)
      const sql = connection.query(query, params, (err, result) => {
        result.sql = sql
        if (err) reject(err)
        else resolve(result)
        connection.release(0)
      })
    })
  })
}
mysql.insert = async function (table, values) {
  const result = await mysql.query(`INSERT INTO ${table} SET ?`, values)
  console.log(result.sql.sql)
  return result
}
mysql.select = async function (table, rows, values) {
  const parse = parseValue(values)
  const result = await mysql.query(
    `SELECT ${rows.toString()} FROM ${table} WHERE ${parse}`
  )
  return result
}
mysql.update = async function (table, values, needed) {
  const parse = parseValue(needed)
  const result = await mysql.query(`UPDATE ${table} SET ? WHERE ${parse}`, values)
  return result
}
mysql.delete = async function (table, values) {
  const parse = parseValue(values)
  const result = await mysql.query(`DELETE FROM ${table} WHERE ${parse}`,[])
  return result
}
mysql.filter = async function (values) {
  if (
    values &&
    values.list &&
    values.IdUserOwner &&
    values.age &&
    values.age.length === 2 &&
    values.location &&
    values.location.length === 4 &&
    values.rating &&
    values.rating.length === 2 &&
    values.start > -1 &&
    values.length > -1
  ) {
    values.name = (values.name?'%%':('%' + values.name + '%'));
    const listInterest =
      '`ListInterest` LIKE ?' +
      ' AND `ListInterest` LIKE ?'.repeat(values.list.length - 1 > -1 ?values.list.length - 1:0)
    values.list.length === 0
      ? values.list.push('%%')
      : values.list.map((value) => '%' + value + '%')
    const query =
      'SELECT u.*,(SELECT AVG(RatingValue) FROM Rating WHERE IdUserReceiver = u.IdUserOwner group by IdUserReceiver) AS rating,(SELECT IdUserReceiver FROM Friends WHERE u.IdUserOwner = IdUserReceiver AND IdUserOwner=?) AS friendreceiver,(SELECT IdUserOwner FROM Friends WHERE u.IdUserOwner = IdUserOwner AND `Match`=1 AND IdUserReceiver=?) AS friendowner FROM Users u WHERE u.IdUserOwner != ? AND u.UserName LIKE ? AND' +
      listInterest +
      ' AND Year(CURDATE())-Year(u.DataBirthday) >= ? AND Year(CURDATE())-Year(u.DataBirthday) <= ? AND u.Latitude>= ? AND u.Latitude<= ? AND u.Longitude >= ? AND u.Longitude <= ?  HAVING ((rating IS NULL AND ? = 0) OR (rating >= ? AND rating <= ?)) AND friendowner IS NULL AND friendreceiver IS NULL LIMIT ?,?'
    const result = await mysql.query(query, [
      values.IdUserOwner,
      values.IdUserOwner,
      values.IdUserOwner,
      values.name,
      values.list,
      values.age[0],
      values.age[1],
      ...values.location,
      values.rating[0],
      values.rating[0],
      values.rating[1],
      values.start,
      values.length
    ])
    return result
  }
  return null
}
mysql.getIdUserOwner = async function (username){
  const result = await mysql.query(`SELECT IdUserOwner FROM Users WHERE UserName=?`, username)
  if (result.length > 0)
    return result[0].IdUserOwner
  return null
}
mysql.checkUserExist = async function (values) {
  const result = await mysql.select('Users', "COUNT(*) AS 'Count'", values)
  return result && result.length > 0 && !result[0].Count
}
module.exports = mysql
