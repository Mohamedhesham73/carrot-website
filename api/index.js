// api/index.js
// Vercel serverless entrypoint that forwards every request to Express
const app = require('../server/app');
module.exports = app; // @vercel/node can use an Express app directly
