// server/index.js
const fs = require('fs');
const path = require('path');
const express = require('express');

// Load .env (robust: tries root and /server)
const dotenv = require('dotenv');
const envCandidates = [
  path.join(__dirname, '../.env'),
  path.join(__dirname, '.env'),
  path.resolve(process.cwd(), '.env'),
];
for (const p of envCandidates) {
  if (fs.existsSync(p)) { dotenv.config({ path: p }); break; }
}
console.log('ENV check:', { SMTP_HOST: process.env.SMTP_HOST, SMTP_PORT: process.env.SMTP_PORT });

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === 'production'
      ? {
          useDefaults: true,
          directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'"],   // we load /js/contact.js from same origin
            "style-src": ["'self'"],    // if you later use Google Fonts, we'll add them here
            "img-src": ["'self'", "data:"],
            "connect-src": ["'self'"],  // fetch to /api/contact
            "object-src": ["'none'"]
          }
        }
      : false, // keep CSP off in dev for convenience
    crossOriginEmbedderPolicy: false,
  })
);

app.use(compression());
app.use(morgan('dev'));

/* ---------- Parsers (JSON/form) ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// views + static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  express.static(
    path.join(__dirname, '../public'),
    NODE_ENV === 'production' ? { maxAge: '1d', etag: true } : undefined
  )
);


/* ---------- Routes ---------- */
// pages
app.get('/',         (_req, res) => res.render('home',      { title: 'Carrot — Home',      page: 'home' }));
app.get('/about',    (_req, res) => res.render('about',     { title: 'About — Carrot',     page: 'about' }));
app.get('/services', (_req, res) => res.render('services',  { title: 'Services — Carrot',  page: 'services' }));
app.get('/portfolio',(_req, res) => res.render('portfolio', { title: 'Portfolio — Carrot', page: 'portfolio' }));
app.get('/contact',  (_req, res) => res.render('contact',   { title: 'Contact — Carrot',   page: 'contact' }));

// API (apply rate limiter ONLY to contact endpoint)
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});
const contactRouter = require('./routes/contact');
app.use('/api/contact', apiLimiter, contactRouter);

/* ---------- 404 & Error handlers (AFTER routes) ---------- */
app.use((req, res) => res.status(404).render('404', { title: 'Not found — Carrot', page: '' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).render('500', { title: 'Server error — Carrot', page: '' });
});

/* ---------- Start server LAST ---------- */
app.listen(PORT, () => console.log(`Server → http://localhost:${PORT}  [${NODE_ENV}]`));
