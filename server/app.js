// server/app.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

// Load .env locally (harmless on Vercel; use dashboard envs in prod)
const envCandidates = [
  path.join(process.cwd(), '.env'),
  path.join(__dirname, '../.env'),
  path.join(__dirname, '.env'),
];
for (const p of envCandidates) {
  if (fs.existsSync(p)) { dotenv.config({ path: p }); break; }
}

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';

/* ---------- Security / perf ---------- */
app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === 'production'
      ? {
          useDefaults: true,
          directives: {
            "default-src": ["'self'"],
            "style-src": ["'self'", "https://cdn.jsdelivr.net"],  // bootstrap/aos if used
            "script-src": ["'self'", "https://cdn.jsdelivr.net"],
            "img-src": ["'self'", "data:"],
            "connect-src": ["'self'"],
            "object-src": ["'none'"],
          },
        }
      : false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
app.use(morgan('dev'));

/* ---------- Parsers ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Views + static (use process.cwd() so it works on Vercel) ---------- */
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'server', 'views'));
app.use(express.static(path.join(process.cwd(), 'public')));

/* ---------- Pages ---------- */
app.get('/',        (_req, res) => res.render('home',      { title: 'Carrot — Home',      page: 'home' }));
app.get('/about',   (_req, res) => res.render('about',     { title: 'About — Carrot',     page: 'about' }));
app.get('/services',(_req, res) => res.render('services',  { title: 'Services — Carrot',  page: 'services' }));
app.get('/portfolio',(_req,res) => res.render('portfolio', { title: 'Portfolio — Carrot', page: 'portfolio' }));
app.get('/pricing', (_req, res) => res.render('pricing',   { title: 'Pricing — Carrot',   page: 'pricing' }));
app.get('/contact', (_req, res) => res.render('contact',   { title: 'Contact — Carrot',   page: 'contact' }));

/* ---------- API (rate-limit only contact) ---------- */
const apiLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });
app.use('/api/contact', apiLimiter, require('./routes/contact'));

/* ---------- 404 / 500 ---------- */
app.use((req, res) => res.status(404).render('404', { title: 'Not found — Carrot', page: '' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).render('500', { title: 'Server error — Carrot', page: '' });
});

module.exports = app;
