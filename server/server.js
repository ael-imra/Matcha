const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const users = require('./Router/Users')
const user = require('./Router/User')
const rating = require('./Router/Rating')
const {init,checkUserInfo,sendResponse,fetchDataJSON,checkImage} = require('./tools/tools')
const {query,pool} = require('./tools/mysql')
const {sendActivation} = require('./tools/mail')
const crypto = require('crypto')

init(app,{query,pool,sendActivation,checkUserInfo,sendResponse,fetchDataJSON,crypto,checkImage})
app.use(cors())
app.use(express.json())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use('/users', users)
app.use('/user', user)
app.use('/rating', rating)
app.get('/image/:image', (req, res) => {
  res.sendFile(`${__dirname}/${req.params.image}`)
})
app.get('/images/:image', (req, res) => {
  res.sendFile(`${__dirname}/images/${req.params.image}`)
})
app.listen(process.env.PORT, () => {
  console.log(`Matcha server app listening at http://localhost:${port}`)
})
