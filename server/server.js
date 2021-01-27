const express = require('express')
const app = express()
const http = require('http').createServer(app)
const cors = require('cors')
const bodyParser = require('body-parser')
const users = require('./Router/Users')
const {Authentication,auth} = require('./Router/Authentication')
const rating = require('./Router/Rating')
const tools = require('./tools/tools')
const mysql = require('./tools/mysql')
const { sendMail } = require('./tools/mail')
const crypto = require('crypto')
const Friends = require('./Router/Friends')
const Messages = require('./Router/Messages')
const Notifications = require('./Router/Notifications')
const io = require('socket.io')(http,{
  cors: {
    origin: "*",
  },
  transports: ['websocket', 'polling'],
  pingInterval: 60000
})

tools.init(app, {...mysql,...tools,sendMail,crypto,sockets:[]})
async function sendFriendMyState(Active,IdUserOwner,UserName,sockets)
{
  const friends = await mysql.query('SELECT * FROM Friends WHERE `Match`=1 AND (IdUserOwner=? OR IdUserReceiver=?)',[IdUserOwner,IdUserOwner])
  if (friends.length > 0)
    friends.map(friend=>sockets.map(item=>{
      if ((item.IdUserOwner === friend.IdUserOwner || friend.IdUserReceiver === item.IdUserOwner) && item.IdUserOwner !== IdUserOwner)
        item.emit('status',JSON.stringify({UserName,Active,date:new Date(Date.now()).toISOString()}))
    }))
}
io.on('connection',(socket)=>{
  console.log("User Connected")
  socket.on('token',async (token)=>{
    const result = await mysql.select('Users',['UserName','IdUserOwner','Images'],{JWT:token})
    if (result.length > 0)
    {
      mysql.update('Users',{Active:1},{IdUserOwner:result[0].IdUserOwner,UserName:result[0].UserName})
      socket.IdUserOwner = result[0].IdUserOwner
      socket.UserName = result[0].UserName
      socket.Images = JSON.parse(result[0].Images)[0]
      app.locals.sockets.push(socket)
      setTimeout(()=>sendFriendMyState(1,result[0].IdUserOwner,result[0].UserName,app.locals.sockets),500)
    }
  })
  socket.on('message',async (obj)=>{
    const {user,message} = JSON.parse(obj)
    if (user.UserName && message && message.Content.trim())
    {
      const IdUserOwner = await mysql.getIdUserOwner(user.UserName)
      const result = await mysql.query('SELECT * FROM Friends WHERE `Match`=1 AND ((IdUserOwner=? AND IdUserReceiver=?) OR (IdUserOwner=? AND IdUserReceiver=?))',[socket.IdUserOwner,IdUserOwner,IdUserOwner,socket.IdUserOwner])
      if (result.length > 0)
      {
        let sockerOfFriend = null
        app.locals.sockets.map(item=>{
          if (item.IdUserOwner === IdUserOwner)
            sockerOfFriend = item
        })
        if(sockerOfFriend)
        {
          sockerOfFriend.emit('message',JSON.stringify({user:{UserName:socket.UserName,Images:socket.Images,Active:1},message:{id:message.id,IdUserReceiver:IdUserOwner,Content:message.Content,date:new Date(Date.now()).toISOString()}}))
          mysql.insert("Messages",{IdUserOwner:socket.IdUserOwner,IdUserReceiver:IdUserOwner,Content:message.Content})
        }
        else
          mysql.insert("Messages",{IdUserOwner:socket.IdUserOwner,IdUserReceiver:IdUserOwner,Content:message.Content})
      }
    }
  })
  socket.on('disconnect',async ()=>{
    console.log("user Disconnected")
    mysql.update('Users',{Active:0,LastLogin:new Date(Date.now())},{IdUserOwner:socket.IdUserOwner})
    app.locals.sockets = app.locals.sockets.filter(item=>item.IdUserOwner !== socket.IdUserOwner)
    setTimeout(()=>sendFriendMyState(0,socket.IdUserOwner,socket.UserName,app.locals.sockets),500)
  })
})
app.use(cors())
app.use(express.json())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use('/Authentication',Authentication)
app.use('/Users', users)
app.use('/Rating',auth, rating)
app.use('/Friends',auth,Friends)
app.use('/Messages',auth,Messages)
app.use('/Notifications',auth,Notifications)
app.get('/image/:image', (req, res) => {
  res.sendFile(`${__dirname}/${req.params.image}`)
})
app.get('/images/:image', (req, res) => {
  res.sendFile(`${__dirname}/images/${req.params.image}`)
})
app.use(tools.handleError)
http.listen(process.env.PORT, () => {
  console.log(`Matcha server app listening at http://localhost:${process.env.PORT}`)
})
// mysql.getFriends(583)
