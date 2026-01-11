/**
 * Middleware pentru autentificare bazată pe JWT (JSON Web Token).
 * Este utilizat pentru protejarea rutelor care necesită
 * un utilizator autentificat.
 *
 * Middleware-ul:
 *  - extrage token-ul din header-ul Authorization
 *  - verifică validitatea token-ului
 *  - atașează ID-ul utilizatorului în obiectul request
 */

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Header-ul Authorization trebuie să fie de forma: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.sendStatus(401);

  const token = parts[1];

  try {
    // Verifică și decodează token-ul JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Atașează ID-ul utilizatorului pentru utilizare ulterioară
    req.userId = decoded.id;

    next();
  } catch {
    // Token invalid sau expirat
    res.sendStatus(401);
  }
};
