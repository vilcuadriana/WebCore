/**
 * Controller pentru gestionarea etichetelor (tags).
 * Etichetele sunt utilizate pentru organizarea și clasificarea
 * notițelor în funcție de teme sau cuvinte cheie.
 *
 * Fiecare utilizator își gestionează propriul set de etichete.
 */

const { Tag } = require('../models');

/**
 * Returnează lista tuturor etichetelor create
 * de utilizatorul autentificat.
 */
exports.getAll = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      where: { UserId: req.userId },
      order: [['name', 'ASC']],
    });
    res.json(tags);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Creează o etichetă nouă.
 * Numele etichetei este obligatoriu și este normalizat
 * prin eliminarea spațiilor inutile.
 */
exports.create = async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    if (!name) return res.sendStatus(400);

    const tag = await Tag.create({
      name,
      UserId: req.userId,
    });

    res.status(201).json(tag);
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Șterge o etichetă existentă.
 * Înainte de ștergere, eticheta este decuplată
 * de toate notițele asociate.
 */
exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const tag = await Tag.findOne({
      where: { id, UserId: req.userId },
    });
    if (!tag) return res.sendStatus(404);

    // Elimină relațiile cu notițele
    await tag.setNotes([]);

    await tag.destroy();
    res.sendStatus(204);
  } catch {
    res.sendStatus(500);
  }
};
