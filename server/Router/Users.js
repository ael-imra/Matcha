const express = require('express')
const router = express.Router()
const Validate = require('../tools/validate')
const md5 = require('md5')
const haversine = require('haversine-distance')
const {auth} = require('./Authentication')
require('dotenv').config({
  path: __dirname + '/../.env',
})

router.get('/', auth, async function (req, res) {
  const locals = req.app.locals;
  const result = await locals.select('Users', ['IsActive'], {
    Token: req.userInfo.Token,
  });
  if (result.length !== 0) locals.sendResponse(res, 200, result[0], true);
})

router.post('/',auth, async function (req, res) {
  const { Latitude, Longitude } = req.userInfo
  const { list, age, name, location,sexual,rating, start,length } = req.body
  const locals = req.app.locals
  const filterResult = await locals.filter({
    IdUserOwner:req.userInfo.IdUserOwner,
    name,
    age,
    rating,
    sexual:req.userInfo.Sexual
  })
  if (filterResult.length > 0){
    filterResult.map(item=>item.distance = haversine({ lat: item.Latitude, lng: item.Longitude },{ lat: Latitude, lng: Longitude })) 
    function cmp(a,b){
      const keysNeedToCompare = ['distance','rating','age']
      let count1 = 0,count2 = 0
      list.push(...JSON.parse(req.userInfo.ListInterest))
      list.map(item=>{
        if (a.ListInterest.indexOf(item) > -1)
          count1++
        if (b.ListInterest.indexOf(item) > -1)
          count2++
      })
      for (let key of Object.keys(a))
      {
        if (keysNeedToCompare.indexOf(key) > -1)
        {
          if (a[key] > b[key])
            count1++
          else if (a[key] < b[key])
            count2++
        }
      }
      return (count1 - count2)
    }
    filterResult.sort(cmp)
    locals.sendResponse(res, 200, filterResult.slice(start,length+start), true)
  } 
  else locals.sendResponse(res, 400, 'someting wrong with your data')
})

router.post('/CheckActive', async function (req, res) {
  const { Email, Password } = req.body;
  const locals = req.app.locals;
  if (Email && Password) {
    const result = await locals.select('Users', '*', { Email, Password, IsActive: 1 });
    if (result && result.length > 0) locals.sendResponse(res, 200, result, true);
    else locals.sendResponse(res, 400, 'User Not Found');
  } else locals.sendResponse(res, 400, 'Bad Request');
});

router.post('/ForgatPassword', async function (req, res) {
  const { Email } = req.body;
  const locals = req.app.locals;
  if (Validate('Email', Email)) {
    const result = await locals.select('Users', '*', { Email });
    if (result && result.length !== 0) {
      locals.sendMail('create new password your email address', 'to create new password', Email, result[0].UserName, `${process.env.CLIENT_PROTOCOL}://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/ForgatPassword/?token=${result[0].Token}`);
      locals.sendResponse(res, 200, result[0].Email);
    } else locals.sendResponse(res, 200, 'Email not Found');
  } else locals.sendResponse(res, 200, 'Bad Request');
});

router.get('/Active', async function (req, res) {
  const Token = req.query.token;
  const locals = req.app.locals;
  if (Token) {
    const result = await locals.select('Users', "COUNT(*) AS 'Count'", { Token });
    if (result && result.length > 0 && result[0].Count === 1) {
      locals.update('Users', { IsActive: 2, Token: locals.crypto.randomBytes(64).toString('hex') }, { Token });
      locals.sendResponse(res, 200, 'Account Now is Active');
    } else locals.sendResponse(res, 400, 'Account Not Found');
  } else locals.sendResponse(res, 400, 'Account Not Found');
});

router.post('/ResetPassword', async function (req, res) {
  const { Token, Password, Confirm } = req.body;
  const locals = req.app.locals;
  if (Token && Validate('Password', Confirm) && Password === Confirm) {
    const result = await locals.select('Users', "COUNT(*) AS 'Count'", { Token });
    if (result && result.length > 0 && result[0].Count === 1) {
      const resultUpdate = await locals.update('Users', { Password: md5(Password), Token: locals.crypto.randomBytes(64).toString('hex'), JWT: null }, { Token });
      if (resultUpdate) locals.sendResponse(res, 200, 'Account is Active');
      else locals.sendResponse(res, 403, 'Error on Update Password');
    } else locals.sendResponse(res, 400, 'account not found');
  } else locals.sendResponse(res, 400, 'Bad Request');
});

router.get('/UserNameIsReadyTake/:userName', async function (req, res) {
  const locals = req.app.locals;
  let test = await locals.checkUserExist({ UserName: req.params.userName });
  locals.sendResponse(res, 200, test);
});

router.get('/EmailIsReadyTake/:email', async function (req, res) {
  const locals = req.app.locals;
  let test = await locals.checkUserExist({ Email: req.params.email });
  locals.sendResponse(res, 200, test);
  // if (Validate('Email', req.params.email)) {
  //   const sqlSelect = "SELECT COUNT(*) AS 'Count' FROM Users WHERE `Email`=?";
  //   con.query(sqlSelect, [req.params.email], (err, result) => {
  //     if (err) res.send(err);
  //     res.send(result[0].Count === 0 ? true : false);
  //   });
  // } else res.send('ops...');
});

module.exports = router
