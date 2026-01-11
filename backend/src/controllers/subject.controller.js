/**
 * Controller pentru gestionarea materiilor.
 * Materiile sunt utilizate pentru organizarea notițelor
 * în funcție de cursuri sau discipline de studiu.
 *
 * Fiecare utilizator își gestionează propriul set de materii.
 */

const { Subject, Note } = require('../models');

/**
 * Returnează lista tuturor materiilor create
 * de utilizatorul autentificat.
 */
exports.getAll = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      where: { UserId: req.userId },
      order: [['name', 'ASC']],
    });
    res.json(subjects);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Creează o materie nouă.
 * Numele materiei este obligatoriu.
 */
exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) return res.sendStatus(400);

    const subject = await Subject.create({
      name: name.trim(),
      description,
      UserId: req.userId,
    });

    res.status(201).json(subject);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Actualizează informațiile unei materii existente.
 * Doar proprietarul materiei poate efectua această operație.
 */
exports.update = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      where: { id: req.params.id, UserId: req.userId },
    });
    if (!subject) return res.sendStatus(404);

    await subject.update({
      name: req.body.name ?? subject.name,
      description: req.body.description ?? subject.description,
    });

    res.json(subject);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Șterge o materie.
 * Înainte de ștergere, notițele asociate sunt decuplate
 * pentru a evita pierderea datelor.
 */
exports.remove = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      where: { id: req.params.id, UserId: req.userId },
    });
    if (!subject) return res.sendStatus(404);

    // Elimină asocierea materiei din notițe
    await Note.update(
      { SubjectId: null },
      { where: { SubjectId: subject.id } }
    );

    await subject.destroy();
    res.sendStatus(204);
  } catch {
    res.sendStatus(500);
  }
};
