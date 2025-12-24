const { Subject, Note } = require('../models');

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

exports.remove = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      where: { id: req.params.id, UserId: req.userId },
    });
    if (!subject) return res.sendStatus(404);

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
