const { StudyGroup, GroupMember, User } = require('../models');

exports.create = async (req, res) => {
  try {
    const group = await StudyGroup.create({
      name: req.body.name,
      UserId: req.userId,
    });

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

exports.getMyGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.findAll({
      include: [{
        model: GroupMember,
        where: { UserId: req.userId },
      }],
    });

    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare listare grupuri' });
  }
};

exports.invite = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Utilizator inexistent' });

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
