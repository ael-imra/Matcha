const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Validate, isValidDate, getAge } = require('../tools/validate');
const md5 = require('md5');
const Jimp = require('jimp');
const { auth } = require('./Authentication');
router.post('/EditInfoUser', auth, async function (req, res) {
  const locals = req.app.locals;
  const ListInterest = JSON.stringify(req.body.ListInterest);
  const { UserName, Email, FirstName, LastName, DataBirthday, Biography, Sexual, Gender } = req.body;
  if ((UserName, Email, FirstName, LastName, FirstName, DataBirthday, Biography, Sexual, Gender, ListInterest, Validate('Username', UserName), Validate('Email', Email), Validate('Name', FirstName), Validate('Name', LastName), isValidDate(DataBirthday), getAge(DataBirthday) >= 18)) {
    const userReadyTake = await locals.query('select COUNT(*) As COUNT from Users WHERE UserName=?', UserName);
    const EmailReadyTake = await locals.query('select COUNT(*) As COUNT from Users WHERE Email=?', Email);
    if ((userReadyTake[0].COUNT !== 1 || req.userInfo.UserName === UserName) && (EmailReadyTake[0].COUNT !== 1 || req.userInfo.Email === Email)) {
      const needed = {
        Token: req.userInfo.Token,
      };
      const result = await locals.update('Users', { UserName, Email, FirstName, LastName, DataBirthday, Biography, Sexual, Gender, ListInterest }, needed);
      if (result) locals.sendResponse(res, 200, 'successful');
      else locals.sendResponse(res, 200, 'Something wrong');
    } else locals.sendResponse(res, 200, 'Something wrong');
  } else locals.sendResponse(res, 200, 'Something wrong');
});

router.post('/AddImage', auth, async function (req, res) {
  const locals = req.app.locals;
  const image = req.body.image;
  if (await locals.checkImages([image])) {
    let ImagesUser = await locals.getImage(req.userInfo.Token, locals);
    if (JSON.parse(ImagesUser[0].Images).length < 5) {
      const nameImage = crypto.randomBytes(16).toString('hex');
      const buffer = Buffer.from(image.split(',')[1], 'base64');
      Jimp.read(buffer, (err, res) => {
        res.quality(40).write(`./images/${nameImage}.jpg`);
      });
      let newImages = [...JSON.parse(ImagesUser[0].Images), `http://localhost:5000/images/${nameImage}.jpg`];
      const needed = {
        Token: req.userInfo.Token,
      };
      const values = {
        Images: JSON.stringify(newImages),
      };
      await locals.update('Users', values, needed);
      locals.sendResponse(res, 200, `http://localhost:5000/images/${nameImage}.jpg`, true);
    } else locals.sendResponse(res, 200, 'or');
  } else locals.sendResponse(res, 200, 'Error');
});
router.post('/DeleteImage', auth, async function (req, res) {
  const locals = req.app.locals;
  let ImagesUser = await locals.getImage(req.userInfo.Token, locals);
  let array = JSON.parse(ImagesUser[0].Images);
  array.splice(req.body.index, 1);
  const needed = {
    Token: req.userInfo.Token,
  };
  const values = {
    Images: JSON.stringify(array),
  };
  const result = await locals.update('Users', values, needed);
  locals.sendResponse(res, 200, req.body, true);
});
router.post('/MakeImageDefault', auth, async function (req, res) {
  const locals = req.app.locals;
  let ImagesUser = await locals.getImage(req.userInfo.Token, locals);
  let arrayImage = await JSON.parse(ImagesUser[0].Images);
  [arrayImage[0], arrayImage[req.body.index]] = [arrayImage[req.body.index], arrayImage[0]];
  const needed = {
    Token: req.userInfo.Token,
  };
  const values = {
    Images: JSON.stringify(arrayImage),
  };
  await locals.update('Users', values, needed);
  locals.sendResponse(res, 200, req.body, true);
});
router.post('/ChangePasswordProfile', auth, async function (req, res) {
  const locals = req.app.locals;
  const password = await locals.getPassword(req.userInfo.Token, locals);
  if (req.body.CurrentPassword && req.body.NewPassword && req.body.ConfirmPassword === req.body.NewPassword && Validate('Password', req.body.NewPassword) && md5(req.body.CurrentPassword) === password[0].Password) {
    const needed = {
      Token: req.userInfo.Token,
    };
    const values = {
      Password: md5(req.body.NewPassword),
    };
    const result = await locals.update('Users', values, needed);
    if (result) res.send('succuss Update Password');
    else res.send('failed');
  } else res.send('failed');
});
router.post('/GetUser/:userName', auth, async function (req, res) {
  const locals = req.app.locals;
  if (req.params.userName) {
    const IdUserReceiver = await locals.getIdUserOwner(req.params.userName);
    const ifNotBlock = await locals.ifNotBlock(req.userInfo.IdUserOwner, IdUserReceiver, locals);
    if (ifNotBlock) {
      const result = await locals.select('Users', ['FirstName', 'UserName', 'Email', 'DataBirthday', 'LastName', 'City', 'Gender', 'Sexual', 'Biography', 'ListInterest', 'Images'], {
        UserName: req.params.userName,
        IsActive: 1,
      });
      if (result[0]) {
        if (result[0].UserName !== req.userInfo.UserName) {
          await locals.insert('Hitory', {
            IdUserOwner: IdUserReceiver,
            IdUserReceiver: req.userInfo.IdUserOwner,
            Content: `${req.userInfo.UserName} visit you profile`,
            DateCreation: new Date(),
          });
          await locals.insert('Hitory', {
            IdUserOwner: req.userInfo.IdUserOwner,
            IdUserReceiver: IdUserReceiver,
            Content: `your visit profile of ${req.params.userName}`,
            DateCreation: new Date(),
          });
        }
        locals.sendResponse(res, 200, result[0]);
      } else locals.sendResponse(res, 200, 'User not found');
    } else locals.sendResponse(res, 200, 'User not found');
  } else locals.sendResponse(res, 200, 'User not found');
});
router.post('/CheckProfileOfYou/:userName', auth, async function (req, res) {
  const locals = req.app.locals;
  const IdUserReceiver = await locals.getIdUserOwner(req.params.userName);
  const ifNotBlock = await locals.ifNotBlock(req.userInfo.IdUserOwner, IdUserReceiver, locals);
  if (ifNotBlock) {
    const test = await locals.checkProfileOfYou(req.userInfo.Token, req.params.userName, locals);
    const result = await locals.checkUserNotReport({
      IdUserOwner: req.userInfo.IdUserOwner,
      IdUserReceiver: IdUserReceiver,
    });
    res.send({ isProfileOfYou: test, isNotReport: result });
  } else res.send({ isProfileOfYou: 'User not found', isNotReport: false });
});
router.post('/BlockUser/:userName', auth, async function (req, res) {
  const locals = req.app.locals;
  const IdUserReceiver = await locals.getIdUserOwner(req.params.userName);
  if (IdUserReceiver) {
    const ifNotBlock = await locals.ifNotBlock(req.userInfo.IdUserOwner, IdUserReceiver, locals);

    if (ifNotBlock) {
      const values = {
        IdUserOwner: req.userInfo.IdUserOwner,
        IdUserReceiver: IdUserReceiver,
        DateBlock: new Date(),
      };
      const resultInsert = await locals.insert('Blacklist', values);
      if (resultInsert) {
        await locals.delete('Hitory', {
          IdUserOwner: req.userInfo.IdUserOwner,
          IdUserReceiver: IdUserReceiver,
        });
        await locals.delete('Hitory', {
          IdUserOwner: IdUserReceiver,
          IdUserReceiver: req.userInfo.IdUserOwner,
        });
        locals.sendResponse(res, 200, 'successful');
      } else locals.sendResponse(res, 200, 'Error');
    } else locals.sendResponse(res, 200, 'Error');
  } else locals.sendResponse(res, 200, 'Error');
});

router.post('/ReportUser/:userName', auth, async function (req, res) {
  const locals = req.app.locals;
  const IdUserReceiver = await locals.getIdUserOwner(req.params.userName);
  if (IdUserReceiver) {
    const ifNotBlock = await locals.ifNotBlock(req.userInfo.IdUserOwner, IdUserReceiver, locals);
    const checkUserNotReport = await locals.checkUserNotReport({
      IdUserOwner: req.userInfo.IdUserOwner,
      IdUserReceiver: IdUserReceiver,
    });
    if (ifNotBlock && checkUserNotReport) {
      const values = {
        IdUserOwner: req.userInfo.IdUserOwner,
        IdUserReceiver: IdUserReceiver,
        Datereport: new Date(),
      };
      const resultInsert = await locals.insert('report', values);
      if (resultInsert) {
        const value = {
          IdUserOwner: IdUserReceiver,
          IdUserReceiver: req.userInfo.IdUserOwner,
          Content: `${req.userInfo.UserName} report you`,
          DateCreation: new Date(),
        };
        const resultInsert = await locals.insert('Hitory', value);
        if (resultInsert) locals.sendResponse(res, 200, 'successful');
        else locals.sendResponse(res, 200, 'Error');
      } else locals.sendResponse(res, 200, 'Error');
    } else locals.sendResponse(res, 200, 'Error');
  } else locals.sendResponse(res, 200, 'Error');
});
router.post('/UserReadyTake', auth, async function (req, res) {
  const locals = req.app.locals;
  if (req.body.UserName) {
    const userReadyTake = await locals.query('select COUNT(*) As COUNT from Users WHERE UserName=?', req.body.UserName);
    if (userReadyTake[0].COUNT === 0 || req.userInfo.UserName === req.body.UserName) res.send(true);
    else res.send(false);
  } else res.send('Error');
});
router.post('/EmailReadyTake', auth, async function (req, res) {
  const locals = req.app.locals;
  if (req.body.Email) {
    const EmailReadyTake = await locals.query('select COUNT(*) As COUNT from Users WHERE Email=?', req.body.Email);
    if (EmailReadyTake[0].COUNT !== 1 || req.userInfo.Email === req.body.Email) res.send(true);
    else res.send(false);
  } else res.send('Error');
});

module.exports = router;