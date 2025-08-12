const express = require('express');
const { body, validationResult } = require('express-validator');
const transporter = require('../email');
const nodemailer = require('nodemailer'); // for preview URL in dev

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message is too short'),
    // honeypot—bots often fill it
    body('company').optional({ nullable: true, checkFalsy: true }).isEmpty().withMessage('Spam detected'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'fail',
        errors: errors.array().map(e => ({ field: e.param, msg: e.msg })),
      });
    }

    const { name, email, message } = req.body;
    const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER;
    const MAIL_TO = process.env.MAIL_TO;

    if (!MAIL_FROM || !MAIL_TO) {
      return res.status(500).json({ status: 'error', error: 'Mail config missing' });
    }

    try {
      const info = await transporter.sendMail({
        from: MAIL_FROM,
        to: MAIL_TO,
        replyTo: email,
        subject: 'New Contact — Carrot Website',
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6">
            <h3>New Contact — Carrot Website</h3>
            <p><b>Name:</b> ${escapeHtml(name)}</p>
            <p><b>Email:</b> ${escapeHtml(email)}</p>
            <p><b>Message:</b></p>
            <pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border:1px solid #eee;border-radius:6px;margin:0">${escapeHtml(message)}</pre>
          </div>
        `,
      });

      const preview = nodemailer.getTestMessageUrl?.(info);
      if (preview) console.log('📬 Ethereal preview:', preview);

      return res.json({ status: 'ok' });
    } catch (err) {
      console.error('sendMail error:', err.message || err);
      return res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
  }
);

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

module.exports = router;
