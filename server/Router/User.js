const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const Validate = require('../tools/validate');
const { fetch } = require('../tools/tools');
const { rejects } = require('assert');

let con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Test12345@',
  database: 'Matcha',
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'camagru1337aelimra@gmail.com',
    pass: 'ael-imra@1337',
  },
});

router.post('/ForgatPassword', function (req, res) {
  if (typeof req.body.email !== 'undefined' && req.body.email !== '' && Validate('Email', req.body.email)) {
    const sqlSelect = 'SELECT * FROM Users WHERE `Email` = ?';
    con.query(sqlSelect, [req.body.email], (err, result) => {
      if (err) res.send('Error');
      else {
        if (result.length !== 0) {
          res.send(result[0].Email);
          const mailOptions = {
            from: 'camagru1337aelimra@gmail.com',
            to: req.body.email,
            subject: 'create new password your email address',
            html: `<div>   
                          <p>Hey ${result[0].UserName} </p>
                          <p>please <a href="http://localhost:3000/ForgatPassword/${result[0].Token}"> Click here</a> to create new password your email address</p>
                          </div>`,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        } else res.send('email not found');
      }
    });
  } else res.send('ops ...');
});

router.get('/active', function (req, res) {
  if (typeof req.query.token !== 'undefined' && req.query.token !== '') {
    fetch(`http://localhost:5000/user/verifierToken/${req.query.token}`).then((data) => {
      if (data[0].Count === 1) {
        const sqlUpdate = 'UPDATE `Users` SET `IsActive` = ?  WHERE `Token` = ?';
        const active = 1;
        con.query(sqlUpdate, [active, req.query.token], (err, result) => {
          if (err) res.send('Error');
          else {
            const sqlUpdate = 'UPDATE `Users` SET `Token` = ?  WHERE `Token` = ?';
            con.query(sqlUpdate, [crypto.randomBytes(64).toString('hex'), req.query.token], (err, result) => {
              if (err) res.send('Error');
              else {
                res.send('account is active');
              }
            });
          }
        });
      } else res.send('account not found');
    });
  } else res.send('ops ...');
});

router.post('/ResetPassword', function (req, res) {
  if (
    typeof req.body.token !== 'undefined' &&
    req.body.token !== '' &&
    typeof req.body.password !== 'undefined' &&
    req.body.password !== '' &&
    Validate('Password', req.body.password) &&
    typeof req.body.confirm !== 'undefined' &&
    req.body.confirm !== '' &&
    Validate('Password', req.body.confirm)
  ) {
    fetch(`http://localhost:5000/user/verifierToken/${req.body.token}`).then((data) => {
      if (data[0].Count === 1) {
        if (req.body.password === req.body.confirm) {
          const sqlUpdate = 'UPDATE `Users` SET `Password` = ?  WHERE `Token` = ?';
          con.query(sqlUpdate, [md5(req.body.password), req.body.token], (err, result) => {
            if (err) res.send('Error');
            else {
              const sqlUpdate = 'UPDATE `Users` SET `Token` = ?  WHERE `Token` = ?';
              con.query(sqlUpdate, [crypto.randomBytes(64).toString('hex'), req.body.token], (err, result) => {
                if (err) res.send('Error');
                else {
                  res.send('account is active');
                }
              });
            }
          });
        }
      } else res.send('account not found');
    });
  } else res.send('ops ...');
});

router.get('/verifierToken/:userToken', function (req, res) {
  if (typeof req.params.userToken !== 'undefined' && req.params.userToken && req.params.userToken !== '') {
    const sqlSelect = "SELECT COUNT(*) AS 'Count' FROM Users WHERE `Token` =?";
    con.query(sqlSelect, [req.params.userToken], (err, result) => {
      if (err) res.send('Error');
      else res.send(result);
    });
  } else res.send('ops ...');
});

module.exports = router;
