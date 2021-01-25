const mysql = require('./tools/mysql')
mysql.select('Messages','COUNT(*) AS IsRead',{IsRead:0,IdUserOwner:581,IdUserReceiver:2}).then(data=>console.log(data[0].IsRead))