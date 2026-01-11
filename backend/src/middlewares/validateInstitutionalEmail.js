/**
 * Middleware pentru validarea emailului instituțional.
 * Permite accesul doar utilizatorilor care folosesc
 * adrese de email din domeniul @stud.ase.ro.
 *
 * Este utilizat în special la:
 *  - înregistrare
 *  - autentificare
 */

module.exports = (req, res, next) => {
  // Normalizează emailul introdus
  const email = (req.body.email || '').trim().toLowerCase();

  // Verifică dacă emailul este instituțional
  if (!email.endsWith('@stud.ase.ro')) return res.sendStatus(400);

  next();
};
