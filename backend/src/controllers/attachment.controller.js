/**
 * Controller pentru gestionarea atașamentelor asociate notițelor.
 * Permite:
 *  - încărcarea fișierelor (upload)
 *  - listarea atașamentelor unei notițe
 *  - ștergerea atașamentelor
 * 
 * Accesul este permis doar utilizatorilor care:
 *  - dețin notița
 *  - sau au acces prin partajare (NoteShare)
 */

const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Attachment, Note, NoteShare } = require('../models');

/**
 * Verifică dacă un utilizator are dreptul să acceseze o notiță.
 * Accesul este permis dacă:
 *  - utilizatorul este proprietarul notiței
 *  - sau notița a fost partajată cu acesta
 *
 * @param {number} noteId - ID-ul notiței
 * @param {number} userId - ID-ul utilizatorului autentificat
 * @returns {Promise<Note|null>} Notița dacă accesul este permis, altfel null
 */
async function canAccessNote(noteId, userId) {
  const owned = await Note.findOne({ where: { id: noteId, UserId: userId } });
  if (owned) return owned;

  const share = await NoteShare.findOne({
    where: { NoteId: noteId, UserId: userId },
  });
  if (share) return await Note.findByPk(noteId);

  return null;
}

/**
 * Configurația de stocare pentru multer.
 * Fișierele sunt salvate local în directorul "uploads".
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '..', '..', 'uploads')),

  /**
   * Generează un nume unic pentru fișier pentru a evita coliziuni.
   */
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, name);
  },
});

/**
 * Middleware multer pentru upload fișiere.
 * Limitează dimensiunea maximă a fișierului la 10MB.
 */
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

/**
 * Încarcă un atașament și îl asociază unei notițe.
 * Endpoint-ul verifică:
 *  - dreptul de acces la notiță
 *  - existența fișierului uploadat
 */
exports.uploadForNote = [
  upload.single('file'),
  async (req, res) => {
    try {
      const noteId = Number(req.params.noteId);

      const note = await canAccessNote(noteId, req.userId);
      if (!note) return res.sendStatus(403);
      if (!req.file) return res.sendStatus(400);

      const attachment = await Attachment.create({
        originalName: req.file.originalname,
        storedName: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        NoteId: noteId,
        UserId: req.userId,
      });

      res.status(201).json({
        ...attachment.toJSON(),
        url: `http://localhost:4000/uploads/${attachment.storedName}`,
      });
    } catch {
      res.sendStatus(500);
    }
  },
];

/**
 * Returnează lista tuturor atașamentelor asociate unei notițe.
 * Sunt returnate doar atașamentele dacă utilizatorul are acces la notiță.
 */
exports.listForNote = async (req, res) => {
  try {
    const noteId = Number(req.params.noteId);

    const note = await canAccessNote(noteId, req.userId);
    if (!note) return res.sendStatus(403);

    const items = await Attachment.findAll({
      where: { NoteId: noteId },
      order: [['createdAt', 'DESC']],
    });

    res.json(
      items.map(a => ({
        ...a.toJSON(),
        url: `http://localhost:4000/uploads/${a.storedName}`,
      }))
    );
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Șterge un atașament existent.
 * Operația este permisă doar dacă utilizatorul este proprietarul atașamentului.
 * Fișierul este șters atât din baza de date, cât și de pe disc.
 */
exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const attachment = await Attachment.findOne({
      where: { id, UserId: req.userId },
    });
    if (!attachment) return res.sendStatus(404);

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      attachment.storedName
    );

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await attachment.destroy();
    res.sendStatus(204);
  } catch {
    res.sendStatus(500);
  }
};
