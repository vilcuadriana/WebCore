const { Tag } = require('../models');

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

exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const tag = await Tag.findOne({
      where: { id, UserId: req.userId },
    });
    if (!tag) return res.sendStatus(404);

    await tag.setNotes([]);
    await tag.destroy();
    res.sendStatus(204);
  } catch {
    res.sendStatus(500);
  }
};
