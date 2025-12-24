module.exports = (req, res, next) => {
  const email = (req.body.email || '').trim().toLowerCase();
  if (!email.endsWith('@stud.ase.ro')) return res.sendStatus(400);
  next();
};
