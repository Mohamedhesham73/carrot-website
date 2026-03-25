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

const basicAuth = require('./middleware/basicAuth');
const leadsStore = require('./leadsStore');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/* ---------- Security, perf, logging ---------- */
app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === 'production'
      ? {
          useDefaults: true,
          directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'"],
            "style-src": ["'self'"],
            "img-src": ["'self'", "data:"],
            "connect-src": ["'self'"],
            "object-src": ["'none'"]
          }
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

/* ---------- Views & static ---------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(
  express.static(
    path.join(__dirname, '../public'),
    NODE_ENV === 'production' ? { maxAge: '1d', etag: true } : undefined
  )
);

/* ---------- Page routes ---------- */
app.get('/', (_req, res) => res.render('home', {
  title: 'Carrot Agency — Marketing that Grows',
  page: 'home',
  description: 'Carrot is a performance-first marketing agency offering Social Media, SEO, Paid Ads, and Web services. Tailored to meet your needs.',
}));

app.get('/about', (_req, res) => res.render('about', {
  title: 'About Us — Carrot Agency',
  page: 'about',
  description: 'Learn about Carrot Agency — our team, our approach, and why brands across Egypt, UAE, KSA, and Kuwait trust us to grow their business.',
}));

app.get('/services', (_req, res) => res.render('services', {
  title: 'Services — Carrot Agency',
  page: 'services',
  description: 'Explore Carrot\'s full range of marketing services: Social Media Management, SEO, Paid Ads, Web & CRO, and Design Packages.',
  noTopPad: true,
}));

app.get('/portfolio', (_req, res) => res.render('portfolio', {
  title: 'Portfolio — Carrot Agency',
  page: 'portfolio',
  description: 'See the real results we\'ve delivered for brands like Boba Queen, SHENO, Vitrine, Mr. Dough, and more.',
}));

app.get('/contact', (_req, res) => res.render('contact', {
  title: 'Contact Us — Carrot Agency',
  page: 'contact',
  description: 'Get in touch with Carrot Agency. Tell us your goals and we\'ll build a plan around them. We reply within 24 hours.',
}));

app.get('/pricing', (_req, res) => res.render('pricing', {
  title: 'Pricing — Carrot Agency',
  page: 'pricing',
  description: 'Four clear monthly packages starting from EGP 15,000. Social media, reels, paid ads, shooting sessions, and expected results — all included.',
}));

/* ---------- Admin route ---------- */
app.get('/admin/leads', basicAuth, (req, res) => {
  const leads = leadsStore.readLast(200);
  res.render('admin/leads', { title: 'Leads — Admin', page: '', leads, description: '' });
});

/* ---------- API ---------- */
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});
const contactRouter = require('./routes/contact');
app.use('/api/contact', apiLimiter, contactRouter);

/* ---------- 404 & Error handlers ---------- */
app.use((req, res) => res.status(404).render('404', {
  title: 'Page not found — Carrot Agency',
  page: '',
  description: '',
}));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).render('500', {
    title: 'Server error — Carrot Agency',
    page: '',
    description: '',
  });
});

/* ---------- Start ---------- */
app.listen(PORT, () => console.log(`Server → http://localhost:${PORT}  [${NODE_ENV}]`));
