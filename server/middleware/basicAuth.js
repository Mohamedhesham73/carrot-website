// server/middleware/basicAuth.js
function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm="Carrot Admin"');
  return res.status(401).send('Unauthorized');
}
module.exports = function basicAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic' || !encoded) return unauthorized(res);
  const [u, p] = Buffer.from(encoded, 'base64').toString().split(':');
  if (u === process.env.ADMIN_USER && p === process.env.ADMIN_PASS) return next();
  return unauthorized(res);
};
