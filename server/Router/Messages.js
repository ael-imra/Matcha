const express = require('express');
const router = express.Router()

router.get('/:UserName/:index',async (req,res)=>{
  const locals = req.app.locals
  if (req.params && req.params.UserName)
  {
    req.params.index = parseInt(req.params.index) > 0 ? parseInt(req.params.index) : 0
    const IdUserReceiver = await locals.getIdUserOwner(req.params.UserName)
    const messages = await locals.query('SELECT * FROM Messages WHERE (IdUserOwner=? AND IdUserReceiver=?) OR (IdUserOwner=? AND IdUserReceiver=?) ORDER BY `DateCreation` DESC LIMIT ?,?',[req.userInfo.IdUserOwner,IdUserReceiver,IdUserReceiver,req.userInfo.IdUserOwner,req.params.index,30])
    const arr = []
    if (messages.length > 0)
    {
      messages.map((item)=>{
        if (item.IdUserOwner === req.userInfo.IdUserOwner)
          item.myMessage = true
        else
          item.myMessage = false
        arr.push({myMessage:item.myMessage,date:item.DateCreation.toISOString().slice(0, 19).replace('T', ' '),Content:item.Content})
      })
    }
    if (arr.length === 0 || arr.length < 24)
      arr.push("limit")
    arr.reverse()
    locals.sendResponse(res,200,arr,true)
  }
  else
    locals.sendResponse(res,200,"Wrong UserName")
})
router.get('/',async (req,res)=>{
  const locals = req.app.locals
  const result = await locals.query('SELECT u.UserName,u.IdUserOwner,u.Images,mes.Content,mes.DateCreation,mes.IdUserOwner AS MIdUserOwner,(SELECT COUNT(IsRead) FROM Messages WHERE IsRead=0 AND IdUserReceiver=? AND u.IdUserOwner=IdUserOwner) AS IsRead FROM Users u INNER JOIN (SELECT IdUserOwner,IdUserReceiver,Content,DateCreation,IdMessages,(SELECT MAX(IdMessages) FROM Messages WHERE (m.IdUserOwner = IdUserOwner AND m.IdUserReceiver=IdUserReceiver) OR (m.IdUserOwner = IdUserReceiver AND m.IdUserReceiver=IdUserOwner)) AS mx FROM Messages m WHERE (IdUserOwner = ? OR IdUserReceiver = ?) HAVING m.IdMessages = mx) mes WHERE (mes.IdUserReceiver=u.IdUserOwner AND mes.IdUserReceiver!=?) OR  (mes.IdUserOwner=u.IdUserOwner AND mes.IdUserOwner!=?) ORDER BY `DateCreation` DESC',[req.userInfo.IdUserOwner,req.userInfo.IdUserOwner,req.userInfo.IdUserOwner,req.userInfo.IdUserOwner,req.userInfo.IdUserOwner])
  if (result.length > 0)
  {
    const newObj = {}
    result.map(item=>newObj[item.UserName]={IdUserOwner:item.IdUserOwner,messages:[{Content:item.Content,IsRead:item.IsRead,date:item.DateCreation.toISOString().slice(0, 19).replace('T', ' '),myMessage:item.MIdUserOwner === req.userInfo.IdUserOwner ? 1:0}],UserName:item.UserName,Images:JSON.parse(item.Images)[0]})
    locals.sendResponse(res,200,newObj,true)
  }
  else
    locals.sendResponse(res,200,'Messages Not Found')
})
router.get('/:UserName',async (req,res)=>{
  const locals = req.app.locals
  if (req.params && req.params.UserName)
  {
    const IdUserOwner = await locals.getIdUserOwner(req.params.UserName)
    if (IdUserOwner)
    {
      locals.update('Messages',{IsRead:1},{IdUserOwner,IdUserReceiver:req.userInfo.IdUserOwner})
      locals.sendResponse(res,200,`all Messages of ${req.params.UserName} was readed`)
    }
    else
      locals.sendResponse(res,200,"UserName Doesn't exist")
  }
  else
    locals.sendResponse(res,200,"Bad Request")
})
module.exports = router