const jwt = require('jsonwebtoken');

function verifikoAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Nuk je i kyçur (token mungon)' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token i pavlefshëm ose ka skaduar' });
    }
    req.userId = decoded.userId;
    req.userRoli = decoded.roli;
    next();
  });
}

module.exports = verifikoAuth;