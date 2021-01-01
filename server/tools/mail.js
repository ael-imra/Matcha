const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'camagru1337aelimra@gmail.com',
    pass: 'ael-imra@1337',
  },
})
function sendActivation(email,username,token){
  const mailResult ={
    error:null,
    result:null
  }
  const mailOptions = {
    from: 'camagru1337aelimra@gmail.com',
    to: email,
    subject: 'Activate your email address',
    html: `<div><p>Hey ${username} </p>
            <p>thanks for signing up for Matcha</p>
            <p>please <a href="http://localhost:5000/user/active?token=${token}"> Click here</a> to Activate your email address</p>
            </div>`,
  }
  transporter.sendMail(mailOptions, function (error, info) {
    mailResult.error = error;
    mailResult.result = info
  })
  return (mailResult)
}
module.exports = {
  sendActivation
}