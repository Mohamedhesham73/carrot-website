const fs = require('fs');
const path = require('path');
const PROD = process.env.NODE_ENV === 'production';

const storeFile = path.join(__dirname, 'leads.json');

function readAll() {
  if (PROD) return []; // no disk in Cloud Run
  if (!fs.existsSync(storeFile)) return [];
  try { return JSON.parse(fs.readFileSync(storeFile, 'utf8') || '[]'); }
  catch { return []; }
}

function save(entry) {
  if (PROD) return; // skip in prod
  const all = readAll();
  all.unshift(entry);
  fs.writeFileSync(storeFile, JSON.stringify(all, null, 2));
}

function readLast(n=200) { return readAll().slice(0, n); }

module.exports = { save, readLast };
