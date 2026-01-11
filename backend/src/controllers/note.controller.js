/**
 * Controller pentru gestionarea notițelor.
 * Oferă funcționalități complete de tip CRUD (Create, Read, Update, Delete),
 * gestionarea etichetelor (tags) și partajarea notițelor între utilizatori.
 *
 * Accesul la notițe este controlat pe baza:
 *  - proprietății (utilizatorul care a creat notița)
 *  - permisiunilor acordate prin partajare (view / edit)
 */

const { Note, Tag, User, NoteShare } = require('../models');

/**
 * Verifică dacă utilizatorul are acces la o notiță.
 * Accesul este permis dacă:
 *  - utilizatorul este proprietarul notiței
 *  - sau notița este partajată cu acesta
 *
 * @param {number} noteId - ID-ul notiței
 * @param {number} userId - ID-ul utilizatorului autentificat
 * @param {boolean} requireEdit - indică dacă este necesar drept de editare
 * @returns {Promise<Note|null>} notița dacă accesul este permis, altfel null
 */
async function canAccessNote(noteId, userId, requireEdit = false) {
  const owned = await Note.findOne({
    where: { id: noteId, UserId: userId },
  });
  if (owned) return owned;

  const share = await NoteShare.findOne({
    where: { NoteId: noteId, UserId: userId },
  });

  if (share && (!requireEdit || share.permission === 'edit')) {
    return await Note.findByPk(noteId);
  }

  return null;
}

/**
 * Returnează toate notițele create de utilizatorul curent.
 * Sunt incluse și etichetele asociate fiecărei notițe.
 */
exports.getAll = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { UserId: req.userId },
      include: [Tag],
      order: [['createdAt', 'DESC']],
    });
    res.json(notes);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Returnează o notiță specifică, dacă utilizatorul are acces la aceasta.
 */
exports.getOne = async (req, res) => {
  try {
    const note = await canAccessNote(req.params.id, req.userId);
    if (!note) return res.sendStatus(404);

    const full = await Note.findByPk(note.id, { include: [Tag] });
    res.json(full);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Creează o notiță nouă pentru utilizatorul autentificat.
 * Notița poate fi asociată opțional unei materii.
 */
exports.create = async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      contentMarkdown: req.body.contentMarkdown,
      SubjectId: req.body.subjectId || null,
      UserId: req.userId,
    });
    res.status(201).json(note);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Actualizează o notiță existentă.
 * Operația este permisă doar proprietarului sau utilizatorilor
 * care au primit permisiune de editare.
 */
exports.update = async (req, res) => {
  try {
    const note = await canAccessNote(req.params.id, req.userId, true);
    if (!note) return res.sendStatus(403);

    await note.update({
      title: req.body.title,
      contentMarkdown: req.body.contentMarkdown,
    });

    res.json(note);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Șterge o notiță.
 * Doar proprietarul notiței are dreptul de a efectua această operație.
 */
exports.remove = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { id: req.params.id, UserId: req.userId },
    });
    if (!note) return res.sendStatus(404);

    await note.destroy();
    res.sendStatus(204);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Asociază un set de etichete (tags) unei notițe.
 * Operația este permisă doar utilizatorilor cu drept de editare.
 */
exports.addTags = async (req, res) => {
  try {
    const note = await canAccessNote(req.params.id, req.userId, true);
    if (!note) return res.sendStatus(403);

    const tags = await Tag.findAll({
      where: { id: req.body.tagIds, UserId: req.userId },
    });

    await note.setTags(tags);
    res.json({ message: 'ok' });
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Returnează etichetele asociate unei notițe.
 */
exports.getTags = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id, { include: [Tag] });
    if (!note) return res.sendStatus(404);
    res.json(note.Tags);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Returnează lista notițelor partajate cu utilizatorul curent.
 */
exports.getSharedWithMe = async (req, res) => {
  try {
    const notes = await Note.findAll({
      include: [
        {
          model: User,
          as: 'SharedWith',
          where: { id: req.userId },
          through: { attributes: [] },
        },
        Tag,
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(notes);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Partajează o notiță cu un alt utilizator.
 * Se poate specifica nivelul de permisiune (view / edit).
 */
exports.share = async (req, res) => {
  try {
    const { email, permission = 'view' } = req.body;

    const note = await Note.findOne({
      where: { id: req.params.id, UserId: req.userId },
    });
    if (!note) return res.sendStatus(404);

    const user = await User.findOne({ where: { email } });
    if (!user) return res.sendStatus(404);

    await NoteShare.findOrCreate({
      where: {
        NoteId: note.id,
        UserId: user.id,
      },
      defaults: { permission },
    });

    res.json({ message: 'ok' });
  } catch {
    res.sendStatus(500);
  }
};
