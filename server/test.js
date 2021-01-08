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

mysql.select('Users','*',[1]).then(data=>console.log(data))