/**
 * Controller pentru gestionarea grupurilor de studiu.
 * Permite:
 *  - crearea grupurilor de studiu
 *  - asocierea utilizatorilor în grupuri
 *  - invitarea colegilor
 *  - listarea grupurilor și a membrilor acestora
 *
 * Grupurile de studiu sunt utilizate pentru colaborare
 * și partajarea informațiilor între studenți.
 */

const { StudyGroup, GroupMember, User } = require('../models');

/**
 * Creează un grup de studiu nou.
 * Utilizatorul care creează grupul devine automat owner.
 */
exports.create = async (req, res) => {
  try {
    // Crearea grupului
    const group = await StudyGroup.create({
      name: req.body.name,
      UserId: req.userId,
    });

    // Asocierea creatorului ca owner al grupului
    await GroupMember.create({
      StudyGroupId: group.id,
      UserId: req.userId,
      role: 'owner',
    });

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare creare grup' });
  }
};

/**
 * Returnează lista grupurilor din care face parte
 * utilizatorul autentificat.
 */
exports.getMyGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.findAll({
      include: [
        {
          model: GroupMember,
          where: { UserId: req.userId },
        },
      ],
    });

    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare listare grupuri' });
  }
};

/**
 * Invită un utilizator într-un grup de studiu
 * pe baza adresei de email.
 */
exports.invite = async (req, res) => {
  try {
    const { email } = req.body;

    // Căutare utilizator după email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Utilizator inexistent' });

    // Asocierea utilizatorului cu grupul (dacă nu există deja)
    await GroupMember.findOrCreate({
      where: {
        StudyGroupId: req.params.id,
        UserId: user.id,
      },
    });

    res.json({ message: 'Invitat' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare invitație' });
  }
};

/**
 * Returnează lista membrilor unui grup de studiu.
 * Include informații despre utilizatori.
 */
exports.getMembers = async (req, res) => {
  try {
    const members = await GroupMember.findAll({
      where: { StudyGroupId: req.params.id },
      include: User,
    });

    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare membri' });
  }
};
