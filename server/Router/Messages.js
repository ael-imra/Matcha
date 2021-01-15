const express = require('express');
const router = express.Router()

router.get('/:IdUserReceiver/:index',async (req,res)=>{
  const locals = req.app.locals
  if (req.params && req.params.IdUserReceiver)
  {
    req.params.index = parseInt(req.params.index) > 0 ? parseInt(req.params.index) : 0
    console.log(req.params.IdUserReceiver)
    const messages = await locals.query('SELECT * FROM Messages WHERE (IdUserOwner=? AND IdUserReceiver=?) OR (IdUserOwner=? AND IdUserReceiver=?) ORDER BY `DateCreation` DESC LIMIT ?,?',[req.userInfo.IdUserOwner,req.params.IdUserReceiver,req.params.IdUserReceiver,req.userInfo.IdUserOwner,req.params.index,30])
    const arr = []
    if (messages.length > 0)
    {
      messages.map((item)=>{
        if (item.IdUserOwner === req.userInfo.IdUserOwner)
          item.myMessage = true
        else
          item.myMessage = false
        arr.push({myMessage:item.myMessage,date:item.DateCreation,Content:item.Content})
      })
      arr.reverse()
    }
    if (arr.length === 0)
      arr.push({limit:true})
    locals.sendResponse(res,200,arr,true)
  }
  else
    locals.sendResponse(res,200,"Wrong UserName")
})
module.exports = router