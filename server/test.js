// SELECT u.*,(SELECT AVG(RatingValue) FROM Rating WHERE IdUserReceiver = u.IdUserOwner group by IdUserReceiver) AS av  FROM Users u having av IS NULL OR av > 3.5




const mysql = require('./tools/mysql')
// mysql.update(
//   'Users',
//   {
//     name: 'hello',
//   },
//   {
//     id: 1,
//   }
// )
// mysql.insert('Users',{name:"user123"})
