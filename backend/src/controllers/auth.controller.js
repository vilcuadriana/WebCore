const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

function isInstitutional(email) {
  return email.endsWith('@stud.ase.ro');
}

exports.register = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password, fullName } = req.body;

    if (!isInstitutional(email)) {
      return res.status(400).json({ message: 'Trebuie să folosești email @stud.ase.ro' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Parola trebuie să aibă minim 6 caractere' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email deja înregistrat' });
    }


    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, fullName });


    return res.status(201).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Eroare la înregistrare' });
  }
};

exports.login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;


    if (!isInstitutional(email)) {
      return res.status(400).json({ message: 'Folosește email @stud.ase.ro' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Email sau parolă greșite' });

    const valid = await bcrypt.compare(password || '', user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Email sau parolă greșite' });


    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Eroare la login' });
  }
};
