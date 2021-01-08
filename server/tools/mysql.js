const mysql_object = require('mysql')
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
    const sql = mysql.pool.query(query, params, (err, result) => {
      console.log(sql.sql)
      if (err) reject(err)
      else resolve(result)
    })
  })
}
mysql.insert = async function (table, values) {
  const result = await mysql.query(`INSERT INTO ${table} SET ?`, values)
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
    //  AND r.AVG >= ? AND r.AVG <= ? GROUP BY u.IdUserOwner 
    // u.IdUserOwner != f.IdUserOwner AND r.IdUserReceiver = u.IdUserOwner AND
    //  INNER JOIN Friends f INNER JOIN (SELECT IdUserReceiver,SUM(RatingValue)/COUNT(*) AS AVG FROM Rating GROUP BY IdUserReceiver) r
    values.name = (values.name?'%%':('%' + values.name + '%'));
    const listInterest =
      '`ListInterest` LIKE ?' +
      ' AND `ListInterest` LIKE ?'.repeat(values.list.length - 1 > -1 ?values.list.length - 1:0)
    values.list.length === 0
      ? values.list.push('%%')
      : values.list.map((value) => '%' + value + '%')
    const query =
      'SELECT u.* FROM Users u WHERE u.IdUserOwner != ? AND u.UserName LIKE ? AND ' +
      listInterest +
      ' AND Year(CURDATE())-Year(u.DataBirthday) >= ? AND Year(CURDATE())-Year(u.DataBirthday) <= ? AND u.Latitude>= ? AND u.Latitude<= ? AND u.Longitude >= ? AND u.Longitude <= ? LIMIT ?,?'
    const result = await mysql.query(query, [
      values.IdUserOwner,
      values.name,
      values.list,
      values.age[0],
      values.age[1],
      ...values.location,
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
// mysql.getFriends = async function(IdUserOwner)
// {
//   const result = await mysql.query('SELECT f.IdUserOwner,f.IdUserReceiver FROM Users u, Friends f WHERE ((u.IdUserOwner = f.IdUserReceiver AND f.IdUserOwner=?) OR (u.IdUserOwner = f.IdUserOwner AND f.IdUserReceiver=?))',[IdUserOwner,IdUserOwner])
//   if (result.length > 0)
//   {
//     for (const value of result)
//       value.
//   }
// }
module.exports = mysql
