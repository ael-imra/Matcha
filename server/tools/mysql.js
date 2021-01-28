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
        parse += mysql.pool.escapeId(key)+"="+mysql.pool.escape(value) + " AND "
      else
        parse += mysql.pool.escapeId(key)+"="+mysql.pool.escape(value)
      i++;
    }
  }
  return (parse !== '' ? parse : '1')
}
mysql.query = function (query, params) {
  return new Promise((resolve, reject) => {
    mysql.pool.getConnection((error,connection)=>{
      if (error) resolve(error)
      else
        connection.query(query, params, (err, result) => {
          if (err) reject(err)
          else resolve(result)
          connection.release(0)
        })
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
    values.IdUserOwner &&
    values.age &&
    values.age.length === 2 &&
    values.rating &&
    values.rating.length === 2 &&
    values.sexual
  ) {
    values.name = (values.name?'%%':('%' + values.name + '%'));
    values.sexual = values instanceof Array? JSON.stringify(values.sexual):values.sexual
    const query =
    'SELECT \
      u.IdUserOwner,u.UserName,u.Images,u.Gender,u.ListInterest,u.Latitude,u.Longitude,\
      Year(CURDATE())-Year(u.DataBirthday) AS Age,\
      (SELECT AVG(RatingValue) FROM Rating WHERE IdUserReceiver = u.IdUserOwner group by IdUserReceiver) AS rating,\
      (SELECT IdUserReceiver FROM Friends WHERE u.IdUserOwner = IdUserReceiver AND IdUserOwner=?) AS friendreceiver,\
      (SELECT IdUserOwner FROM Friends WHERE u.IdUserOwner = IdUserOwner AND `Match`=1 AND IdUserReceiver=?) AS friendowner\
      FROM Users u \
      WHERE u.IdUserOwner != ? AND u.UserName LIKE ? AND u.Gender=? AND u.Images != "[]"\
      HAVING Age >= ? AND Age <= ? AND ((rating IS NULL AND ? = 0) OR (rating >= ? AND rating <= ?)) AND friendowner IS NULL AND friendreceiver IS NULL'
      // 'SELECT u.IdUserOwner,u.UserName,u.Images,u.Gender,u.ListInterest,u.Latitude,u.Longitude,Year(CURDATE())-Year(u.DataBirthday) AS Age,(SELECT AVG(RatingValue) FROM Rating WHERE IdUserReceiver = u.IdUserOwner group by IdUserReceiver) AS rating,(SELECT IdUserReceiver FROM Friends WHERE u.IdUserOwner = IdUserReceiver AND IdUserOwner=?) AS friendreceiver,(SELECT IdUserOwner FROM Friends WHERE u.IdUserOwner = IdUserOwner AND `Match`=1 AND IdUserReceiver=?) AS friendowner FROM Users u WHERE u.IdUserOwner != ? AND u.UserName LIKE ? AND ' +
      // listInterest +
      // ' AND Year(CURDATE())-Year(u.DataBirthday) >= ? AND Year(CURDATE())-Year(u.DataBirthday) <= ? HAVING ((rating IS NULL AND ? = 0) OR (rating >= ? AND rating <= ?)) AND friendowner IS NULL AND friendreceiver IS NULL LIMIT ?,?'
    const result = await mysql.query(query, [
      values.IdUserOwner,
      values.IdUserOwner,
      values.IdUserOwner,
      values.name,
      values.sexual,
      values.age[0],
      values.age[1],
      values.rating[0],
      values.rating[0],
      values.rating[1]
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
mysql.checkUserNotReport = async function (values) {
  const result = await mysql.select("report", "COUNT(*) AS 'Count'", values);
  return result && result.length > 0 && !result[0].Count;
};
mysql.selectUsersBlocks = async function (idUserOwner) {
  const result = await mysql.query(
    `SELECT u.IdUserOwner,UserName,Email,Images FROM Users u INNER JOIN Blacklist b WHERE b.idUserOwner=? AND u.IdUserOwner = b.IdUserReceiver ORDER BY IdBlacklist DESC`,
    idUserOwner
  );
  return result;
};
mysql.searchUsersBlocks = async function (idUserOwner, userName) {
  const result = await mysql.query(
    `SELECT u.IdUserOwner,UserName,Email,Images FROM Users u INNER JOIN Blacklist b WHERE b.idUserOwner=? AND u.IdUserOwner = b.IdUserReceiver AND u.UserName LIKE '${userName}%' ORDER BY IdBlacklist DESC`,
    idUserOwner
  );
  return result;
};
mysql.selectHistory = async function (idUserOwner) {
  const result = await mysql.query(
    `SELECT u.IdUserOwner,UserName,Content,Images,DateCreation FROM Users u INNER JOIN Hitory h WHERE h.idUserOwner=? AND u.IdUserOwner = h.IdUserReceiver ORDER BY IdHitory DESC`,
    idUserOwner
  );
  return result;
};
mysql.searchHistory = async function (idUserOwner, userName) {
  const result = await mysql.query(
    `SELECT u.IdUserOwner,UserName,Content,Images,DateCreation FROM Users u INNER JOIN Hitory h WHERE h.idUserOwner=? AND u.IdUserOwner = h.IdUserReceiver AND u.UserName LIKE '${userName}%' ORDER BY IdHitory DESC`,
    idUserOwner
  );
  return result;
};
module.exports = mysql
