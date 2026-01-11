/**
 * Controller pentru autentificare și înregistrare utilizatori.
 * Gestionează:
 *  - validarea emailului instituțional (@stud.ase.ro)
 *  - criptarea parolelor folosind bcrypt
 *  - autentificarea utilizatorilor și generarea token-urilor JWT
 *
 * Acest controller reprezintă mecanismul principal de securitate
 * al aplicației.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Normalizează adresa de email.
 * Elimină spațiile și transformă textul în lowercase
 * pentru a evita duplicatele.
 *
 * @param {string} email - adresa de email introdusă de utilizator
 * @returns {string} email normalizat
 */
function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

/**
 * Verifică dacă emailul este instituțional.
 * Sunt acceptate doar adresele de forma @stud.ase.ro.
 *
 * @param {string} email
 * @returns {boolean}
 */
function isInstitutional(email) {
  return email.endsWith('@stud.ase.ro');
}

/**
 * Înregistrează un utilizator nou în aplicație.
 * Validează emailul instituțional și parola,
 * apoi salvează parola criptată în baza de date.
 */
exports.register = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password, fullName } = req.body;

    // Verificare email instituțional
    if (!isInstitutional(email)) {
      return res.status(400).json({ message: 'Trebuie să folosești email @stud.ase.ro' });
    }

    // Validare parolă minimă
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Parola trebuie să aibă minim 6 caractere' });
    }

    // Verificare existență utilizator
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email deja înregistrat' });
    }

    // Criptarea parolei
    const passwordHash = await bcrypt.hash(password, 10);

    // Crearea utilizatorului
    const user = await User.create({ email, passwordHash, fullName });

    // Răspuns fără date sensibile
    res.status(201).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    });
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Autentifică un utilizator existent.
 * Verifică parola și returnează un token JWT
 * utilizat pentru autorizarea cererilor ulterioare.
 */
exports.login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    // Validare email instituțional
    if (!isInstitutional(email)) {
      return res.status(400).json({ message: 'Folosește email @stud.ase.ro' });
    }

    // Căutare utilizator
    const user = await User.findOne({ where: { email } });
    if (!user) return res.sendStatus(401);

    // Comparare parolă
    const valid = await bcrypt.compare(password || '', user.passwordHash);
    if (!valid) return res.sendStatus(401);

    // Generare token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    });
  } catch {
    res.sendStatus(500);
  }
};
