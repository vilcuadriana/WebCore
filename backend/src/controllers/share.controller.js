const { Note, User, NoteShare } = require('../models');

exports.shareNote = async (req, res) => {
  try {
    const { email, permission = 'view' } = req.body;
    const noteId = Number(req.params.id);

    const note = await Note.findOne({
      where: { id: noteId, UserId: req.userId },
    });
    if (!note) return res.sendStatus(404);

    const user = await User.findOne({ where: { email } });
    if (!user) return res.sendStatus(404);

    await NoteShare.findOrCreate({
      where: {
        NoteId: noteId,
        UserId: user.id,
      },
      defaults: { permission },
    });

    res.json({ message: 'ok' });
  } catch {
    res.sendStatus(500);
  }
};

exports.getSharedNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      include: [
        {
          model: User,
          as: 'SharedWith',
          where: { id: req.userId },
          through: { attributes: [] },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(notes);
  } catch {
    res.sendStatus(500);
  }
};
