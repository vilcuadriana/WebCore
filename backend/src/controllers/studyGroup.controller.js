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

const {
  StudyGroup,
  GroupMember,
  Note,
  User,
} = require('../models');

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


/**
 * Returnează notițele tuturor membrilor unui grup.
 */
exports.getGroupNotes = async (req, res) => {
  try {
    // 1️⃣ Găsim membrii grupului
    const members = await GroupMember.findAll({
      where: { StudyGroupId: req.params.id },
      attributes: ['UserId'],
    });

    const userIds = members.map(m => m.UserId);

    // 2️⃣ Găsim notițele create de acești utilizatori
    const notes = await Note.findAll({
      where: {
        UserId: userIds,
      },
      include: {
        model: User,
        attributes: ['id', 'fullName', 'email'],
      },
      order: [['createdAt', 'DESC']],
    });

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare notițe grup' });
  }
};
/**
 * Returnează detaliile unui grup
 * DOAR dacă utilizatorul este membru.
 */
exports.getGroupById = async (req, res) => {
  try {
    const member = await GroupMember.findOne({
      where: {
        StudyGroupId: req.params.id,
        UserId: req.userId,
      },
    });

    if (!member) {
      return res.status(403).json({ message: 'Nu faci parte din acest grup' });
    }

    const group = await StudyGroup.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Grup inexistent' });
    }

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare grup' });
  }
};

/**
 * Șterge un grup de studiu.
 * Doar owner-ul are acest drept.
 */
exports.deleteGroup = async (req, res) => {
  try {
    const owner = await GroupMember.findOne({
      where: {
        StudyGroupId: req.params.id,
        UserId: req.userId,
        role: 'owner',
      },
    });

    if (!owner) {
      return res.status(403).json({
        message: 'Nu ai dreptul să ștergi acest grup',
      });
    }

    await StudyGroup.destroy({
      where: { id: req.params.id },
    });

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare ștergere grup' });
  }
};
