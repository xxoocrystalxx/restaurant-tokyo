const nodemailer = require('nodemailer')
const config = require('../config/mail')

const transporter = nodemailer.createTransport({
  service: config.service,
  host: config.host,
  port: config.port,
  auth: {
    user: config.user,
    pass: config.password,
  },
})

exports.sendMail = (fields) => transporter.sendMail(fields)
