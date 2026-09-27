const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_practical9';

/**
 * Strict authentication middleware
 * Rejects requests without valid Bearer JWT
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token. Expected format: Bearer <token>' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
};

/**
 * Optional authentication middleware
 * Decodes user if token provided, but permits public testing
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // invalid token, proceed unauthenticated
    }
  }
  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  JWT_SECRET
};
