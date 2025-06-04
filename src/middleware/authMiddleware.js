const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

function authenticateToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // { userId, role, companyId }
    next();
  });
}

function requireSupportRole(req, res, next) {
  if (req.user && req.user.role === 'support') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Support only.' });
}

module.exports = { authenticateToken, requireSupportRole };
