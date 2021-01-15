const express = require('express')
const router = express.Router()

router.post('/Invite',async (req,res)=>{
  const {Username} = req.body
  const locals = req.app.locals
  if (Username)
  {
    const IdUserOwner = await locals.getIdUserOwner(Username)
    if (IdUserOwner)
    {
      const checkFriends = await locals.query('SELECT * FROM Friends WHERE (IdUserOwner=? AND IdUserReceiver=?) OR (IdUserOwner=? AND IdUserReceiver=?)',[req.userInfo.IdUserOwner,IdUserOwner,IdUserOwner,req.userInfo.IdUserOwner])
      if (checkFriends && checkFriends.length > 0)
      {
        if (checkFriends[0].Match)
          locals.update('Friends',{Match:0},{IdUserOwner:checkFriends[0].IdUserOwner,IdUserReceiver:checkFriends[0].IdUserReceiver})
        else
          locals.update('Friends',{Match:1},{IdUserOwner:checkFriends[0].IdUserOwner,IdUserReceiver:checkFriends[0].IdUserReceiver})
        locals.sendResponse(res,200,'Friend has been updated')
      }
      else
      {
        locals.insert('Friends',{IdUserOwner:req.userInfo.IdUserOwner,IdUserReceiver:IdUserOwner})
        locals.sendResponse(res,200,'Friend has been created')
      }
    }
    else
      locals.sendResponse(res,400,"Username is wrong")
  }
  else
    locals.sendResponse(res,400,"Bad Request")
})
router.get('/',async (req,res)=>{
  const locals = req.app.locals
  const result = await locals.query('SELECT u.IdUserOwner,u.Images,u.UserName,u.LastLogin,u.Active FROM Users u,Friends f WHERE f.Match=1 AND ((f.IdUserOwner=? AND u.IdUserOwner = f.IdUserReceiver) OR (f.IdUserReceiver=? AND u.IdUserOwner = f.IdUserOwner))',[req.userInfo.IdUserOwner,req.userInfo.IdUserOwner])
  if (result.length > 0)
  {
    result.map((item,index)=>result[index]={...item,Images:JSON.parse(item.Images)[0]})
      locals.sendResponse(res,200,result,true)
  }
  else
    locals.sendResponse(res,200,'bad request')
})

module.exports = router