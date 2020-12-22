const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const users = require('./users.js');
const user = require('./user.js');

const con = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Test12345@',
  database: 'Matcha',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/users', users);
app.use('/user', user);
app.get('/image/:image', (req, res) => {
  res.sendFile(`${__dirname}/${req.params.image}`);
});
app.get('/images/:image', (req, res) => {
  res.sendFile(`${__dirname}/images/${req.params.image}`);
});
app.listen(port, () => {
  console.log(`Matcha server app listening at http://localhost:${port}`);
});
