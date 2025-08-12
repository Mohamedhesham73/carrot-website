// server/email.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // <— add this line

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,                    // must be smtp.ethereal.email
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,  // true only for 465
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

transporter.verify(err => {
  if (err) console.error('❌ SMTP error:', err.message, 'host:', process.env.SMTP_HOST, 'port:', process.env.SMTP_PORT);
  else console.log('✅ SMTP ready:', process.env.SMTP_HOST + ':' + process.env.SMTP_PORT);
});

module.exports = transporter;
