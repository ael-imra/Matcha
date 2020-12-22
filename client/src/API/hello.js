const fs = require('fs');
fs.open('../API/Countries.json','r',(err,fd)=>{
  console.log(fd);
})