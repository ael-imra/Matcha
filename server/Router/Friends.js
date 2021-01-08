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
      const checkFriends = await locals.select('Friends','*',{IdUserOwner:req.userInfo.IdUserOwner,IdUserReceiver:IdUserOwner})
      if (checkFriends && checkFriends.length > 0)
      {
        if (checkFriends[0].Active)
          locals.update('Friends',{Active:0},{IdUserOwner:req.userInfo.IdUserOwner,IdUserReceiver:IdUserOwner})
        else
          locals.update('Friends',{Active:1},{IdUserOwner:req.userInfo.IdUserOwner,IdUserReceiver:IdUserOwner})
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
  const result = await locals.select('Friends',{IdUserOwner:req.userInfo.IdUserOwner}) 
})

module.exports = router