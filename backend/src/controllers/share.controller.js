/**
 * Controller pentru partajarea notițelor între utilizatori.
 * Permite:
 *  - partajarea unei notițe cu un alt utilizator pe baza emailului
 *  - vizualizarea notițelor care au fost partajate cu utilizatorul curent
 *
 * Partajarea este realizată prin entitatea NoteShare,
 * care gestionează permisiunile de acces (view / edit).
 */

const { Note, User, NoteShare } = require('../models');

/**
 * Partajează o notiță cu un alt utilizator.
 * Doar proprietarul notiței poate efectua această operație.
 *
 * @param {string} email - emailul utilizatorului cu care se partajează notița
 * @param {string} permission - nivelul de acces (view / edit)
 */
exports.shareNote = async (req, res) => {
  try {
    const { email, permission = 'view' } = req.body;
    const noteId = Number(req.params.id);

    // Verifică dacă notița aparține utilizatorului curent
    const note = await Note.findOne({
      where: { id: noteId, UserId: req.userId },
    });
    if (!note) return res.sendStatus(404);

    // Caută utilizatorul destinatar după email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.sendStatus(404);

    // Creează relația de partajare dacă nu există deja
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

/**
 * Returnează lista notițelor care au fost partajate
 * cu utilizatorul autentificat.
 */
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
