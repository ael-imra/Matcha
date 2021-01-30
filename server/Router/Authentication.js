const express = require('express');
const router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const { Validate } = require('../tools/validate');
require('dotenv').config({ path: __dirname + '/../.env' });

async function auth(req, res, next) {
  const authorization = req.headers['authorization'];
  const locals = req.app.locals;

  if (authorization) {
    if (authorization.split(' ').length > 1) {
      jwt.verify(authorization.split(' ')[1], process.env.JWT_KEY, async (err, payload) => {
        const result = await locals.select('Users', '*', { JWT: authorization.split(' ')[1] });
        if (result.length > 0) {
          if (payload) {
            req.userInfo = result[0];
            next();
          } else if (err.message === 'jwt expired') locals.sendResponse(res, 200, 'Access token expired');
          else locals.sendResponse(res, 200, 'User not authenticated');
        } else locals.sendResponse(res, 200, 'token invalid');
      });
    } else locals.sendResponse(res, 200, 'token invalid');
  } else {
    locals.sendResponse(res, 400, 'token not found');
  }
}
router.get('/Logout', auth, function (req, res) {
  if (req.userInfo) {
    req.app.locals.update('Users', { JWT: null,Active:0 }, { JWT: req.userInfo.JWT });
    req.app.locals.sendResponse(res, 200, "You're now logout");
  } else req.app.locals.sendResponse(res, 403, 'Something wrong please try again');
});
router.post('/Login', async function (req, res) {
  const locals = req.app.locals;
  const { Email, Password } = req.body;
  if (Validate('Email', Email) && Validate('Password', Password)) {
    const result = await locals.select('Users', ['IdUserOwner', 'IsActive', 'JWT', 'Token'], {
      Email,
      Password: md5(Password),
    });
    const resultInfo = await locals.select('Users', ['FirstName', 'LastName', 'UserName', 'Images','IdUserOwner'], {
      Email,
      Password: md5(Password),
    });
    if (result.length !== 0) {
      let data = result[0];
      if (data.IsActive === 1) data = { ...data, ...resultInfo[0], Images: JSON.parse(resultInfo[0].Images)[0] };
      if (data.IsActive === 2) data = { ...data, ...resultInfo[0], Images: 'Images' };
      if (data.JWT) locals.sendResponse(res, 200, { accessToken: data.JWT, data }, true);
      else {
        if (data.IsActive === 1 || data.IsActive === 2) {
          const accessToken = jwt.sign({ data }, process.env.JWT_KEY);
          const resultUpdateJWT = await locals.update('Users', { JWT: accessToken }, { IdUserOwner: data.IdUserOwner });
          if (resultUpdateJWT) locals.sendResponse(res, 200, { accessToken, data }, true);
          else locals.sendResponse(res, 403, 'Something wrong please try again');
        } else locals.sendResponse(res, 200, 'account is not active');
      }
    } else locals.sendResponse(res, 200, 'User Not Found');
  } else locals.sendResponse(res, 200, 'bad user information');
});
router.post('/LoginWithGoogle', async function (req, res) {
  const locals = req.app.locals;
  const { IdToken } = req.body;
  const Email = await locals.verifyIdTokenGoogle(IdToken);
  console.log(Email)
  if (Email) {
    const result = await locals.select('Users', ['IdUserOwner', 'IsActive', 'JWT', 'Token'], {
      Email,
    });
    const resultInfo = await locals.select('Users', ['FirstName', 'LastName', 'UserName', 'Images'], {
      Email,
    });
    if (result.length !== 0) {
      let data = result[0];
      if (data.IsActive === 1) data = { ...data, ...resultInfo[0], Images: JSON.parse(resultInfo[0].Images)[0] };
      if (data.IsActive === 2) data = { ...data, ...resultInfo[0], Images: 'Images' };
      if (data.JWT) locals.sendResponse(res, 200, { accessToken: data.JWT, data }, true);
      else {
        if (data.IsActive === 1 || data.IsActive === 2) {
          const accessToken = jwt.sign({ data }, process.env.JWT_KEY);
          const resultUpdateJWT = await locals.update('Users', { JWT: accessToken }, { IdUserOwner: data.IdUserOwner });
          if (resultUpdateJWT) locals.sendResponse(res, 200, { accessToken, data }, true);
          else locals.sendResponse(res, 403, 'Something wrong please try again');
        } else locals.sendResponse(res, 200, 'account is not active');
      }
    } else locals.sendResponse(res, 200, 'User Not Found');
    
  } else locals.sendResponse(res, 200, 'bad user information');
});
router.post('/Insert', async function (req, res) {
  const { UserName, Email, FirstName, LastName, Password } = req.body;
  const locals = req.app.locals;
  if (Validate('Email', Email) && Validate('Password', Password) && Validate('Username', UserName) && Validate('Name', LastName) && Validate('Name', FirstName)) {
    const result = await locals.checkUserExist({ Email, UserName });
    if (result === true) {
      const userInfo = {
        UserName,
        Email,
        FirstName,
        LastName,
        Password: md5(Password),
        Token: locals.crypto.randomBytes(64).toString('hex'),
        IsActive: 0,
      };
      const resultInsert = await locals.insert('Users', userInfo);
      if (resultInsert) {
        locals.sendMail('Activate your email address', 'to Activate your email address', userInfo.Email, userInfo.UserName, `${process.env.CLIENT_PROTOCOL}://${process.env.CLIENT_HOST}:${process.env.PORT}/Users/Active/?token=${userInfo.Token}`);
        locals.sendResponse(res, 200, 'successful');
      } else locals.sendResponse(res, 403, 'Error');
    } else locals.sendResponse(res, 400, 'user information already taken');
  } else locals.sendResponse(res, 400, 'bad user information');
});
function checkAllImages(images, locals) {
  return new Promise((resolve) => {
    const arr = [];
    let imageList = [];
    let imageCheck = true;
    images.forEach(async (image) => {
      const base64Data = await locals.checkImage(image.src, locals);

      if (base64Data) {
        imageList[0] = image.default === 1 ? base64Data : imageList[0];
        image.default !== 1 ? imageList.push(base64Data) : null;
        arr.push('ok');
      } else {
        arr.push('ko');
        imageCheck = false;
      }
      if (arr.length === images.length) resolve([imageList, imageCheck]);
    });
  });
}
router.post('/CompleteInsert', auth, async function (req, res) {
  const { step1, step2, step3, step4, step5 } = req.body;
  const locals = req.app.locals;
  if ((step1, step2, step3, step4, step5)) {
    const [imageList, imageCheck] = await checkAllImages(step5, locals);
    if (imageCheck) {
      const obj = await locals.fetchDataJSON(step2.country, step2.latitude, step2.longitude, '194.170.36.47');
      const values = {
        DataBirthday: step1,
        Biography: step4.DescribeYourself,
        Gender: step3.youGender,
        Sexual: step3.genderYouAreLooking.toString().replace(',', ' ').trim(),
        Images: JSON.stringify(imageList),
        ListInterest: JSON.stringify(step4.yourInterest),
        IsActive: 1,
        ...obj,
      };
      const needed = {
        Token: req.userInfo.Token,
      };
      const result = await locals.update('Users', values, needed);
      if (result) locals.sendResponse(res, 200, 'successful');
      else locals.sendResponse(res, 403, 'Something wrong With your images');
    } else {
      locals.sendResponse(res, 403, 'Something wrong With your images');
    }
  } else locals.sendResponse(res, 400, 'bad user information');
});

module.exports = { Authentication: router, auth };
