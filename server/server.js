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
const io = require('socket.io')(http,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

tools.init(app, {...mysql,...tools,sendMail,crypto,sockets:[]})
io.on('connection',(socket)=>{
  console.log("User Connected")
  socket.on('token',async (token)=>{
    const result = await mysql.select('Users',['UserName','IdUserOwner'],{JWT:token})
    if (result.length > 0)
    {
      mysql.update('Users',{Active:1},{IdUserOwner:result[0].IdUserOwner,UserName:result[0].UserName})
      socket.IdUserOwner = result[0].IdUserOwner
      socket.UserName = result[0].UserName
      app.locals.sockets.push(socket)
    }
  })
  socket.on('message',async (obj)=>{
    const {UserName,message} = JSON.parse(obj)
    if (UserName && message && message.trim())
    {
      const IdUserOwner = await mysql.getIdUserOwner(UserName)
      const result = await mysql.query('SELECT * FROM Friends WHERE `Match`=1 AND ((IdUserOwner=? AND IdUserReceiver=?) OR (IdUserOwner=? AND IdUserReceiver=?))',[socket.IdUserOwner,IdUserOwner,IdUserOwner,socket.IdUserOwner])
      if (result.length > 0)
      {
        const userSocket = app.locals.sockets.filter(item=>item.IdUserOwner === IdUserOwner)
        if(userSocket.length > 0)
        {
          userSocket[0].emit('message',JSON.stringify({UserName:socket.UserName,Content:message,date:new Date(Date.now()).toISOString()}))
          mysql.insert("Messages",{IdUserOwner:socket.IdUserOwner,IdUserReceiver:IdUserOwner,Content:message})
        }
        else
          mysql.insert("Messages",{IdUserOwner:socket.IdUserOwner,IdUserReceiver:IdUserOwner,Content:message})
      }
    }
  })
  socket.on('disconnect',()=>{
    console.log("user Disconnected")
    mysql.update('Users',{Active:0,LastLogin:new Date(Date.now())},{IdUserOwner:socket.IdUserOwner})
    app.locals.sockets = app.locals.sockets.filter(item=>item.IdUserOwner !== socket.IdUserOwner)
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
