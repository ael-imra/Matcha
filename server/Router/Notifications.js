const express = require('express')
const router = express.Router()

router.get('/readNotifications',(req,res)=>{
  const locals = req.app.locals
  locals.update('Notifications',{IsRead:1},{IdUserReceiver:req.userInfo.IdUserOwner})
  locals.sendResponse(res,200,"Notification Readed")
})

router.get('/:start',async (req,res)=>{
  const locals = req.app.locals
  if (req.params.start >= 0)
  {
    const result = await locals.query('SELECT u.UserName,u.Images,n.IdNotification,n.IdUserReceiver,n.IdUserOwner,n.Type,n.DateCreation FROM Users u,Notifications n WHERE u.IdUserOwner = n.IdUserOwner AND n.IdUserReceiver=? ORDER BY n.DateCreation DESC',[req.userInfo.IdUserOwner])
    if (result.length > 0)
    {
      const IsRead = await locals.query('SELECT COUNT(*) AS IsRead FROM Notifications WHERE IsRead = 0 AND IdUserReceiver=?',[req.userInfo.IdUserOwner])
      result.map((item,index)=>
      {
        item.Images = JSON.parse(item.Images)[0]
        if (index + 1 === result.length)
        locals.sendResponse(res,200,{data:result,IsRead:IsRead.length > 0 ? IsRead[0].IsRead : 0},true)
      })
    }
    else
      locals.sendResponse(res,200,'None')
  }
  else
      locals.sendResponse(res,200,'Bad request')
})
module.exports = router