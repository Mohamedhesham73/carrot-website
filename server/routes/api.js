const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { makeTransport } = require('../lib/mail');

const contactLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(process.env.RATE_LIMIT_MAX || 30),
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ ok:false, error:'Missing fields' });

  try {
    const transporter = await makeTransport();
    const info = await transporter.sendMail({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO,
      subject: `New website inquiry from ${name}`,
      replyTo: email,
      text: message
    });
    const previewUrl = require('nodemailer').getTestMessageUrl(info);
    res.json({ ok:true, previewUrl });
  } catch (e) {
    res.status(500).json({ ok:false, error:'Mail send failed' });
  }
});

module.exports = router;
