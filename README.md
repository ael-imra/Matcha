# Matcha <img src="https://img.shields.io/static/v1?label=&message=socket.io&logo=socket.io&color=gray"/> <img src="https://img.shields.io/static/v1?label=&message=nodejs&logo=node.js&color=gray"/> <img src="https://img.shields.io/static/v1?label=&message=react&logo=react&color=gray"/>

Dating website

## Installation

install package for client and server

```bash
npm --prefix ./server install
npm --prefix ./client install
node ./server/Config/Setup.js #generate 580 users
```

How to run client-side

```bash
cd client
#production mode
npm run startDev #OR
#development mode
npm run startProduc
```

How to run server-side

```bash
cd server
npm run start
```

## Environment Variables

create .env file inside server folder and add the following variables

```env
PORT= <port>
HOST= <host>
PROTOCOL= <protocol>
CLIENT_PORT= <port>
CLIENT_HOST= <host>
CLIENT_PROTOCOL= <protocol>
MYSQL_HOST= <host>
MYSQL_PORT= <port>
MYSQL_USER= <user>
MYSQL_PASSWORD= <password>
MYSQL_DATABASE= <database>
opencagedata_API_KEY= <key>
NODEMAILER_EMAIL= <email>
NODEMAILER_PASS= <password>
JWT_KEY= <key>
```

## Screenshots

Home</br>
![](Screenshots/home_ligh.png)</br>
![](Screenshots/home_dark.png)</br>
SignIN</br>
![](Screenshots/signin_light.png)</br>
![](Screenshots/signin_dark.png)</br>
SignUP</br>
![](Screenshots/signup_light.png)</br>
![](Screenshots/signup_dark.png)</br>
Dashboard</br>
![](Screenshots/dashboard_light.png</br>)
![](Screenshots/dashboard_dark.png)</br>
Profile</br>
![](Screenshots/profile_light.png)</br>
![](Screenshots/profile_dark.png)</br>
History</br>
![](Screenshots/history_light.png)</br>
![](Screenshots/history_dark.png)</br>