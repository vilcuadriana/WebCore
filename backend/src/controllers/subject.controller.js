const { Subject } = require('../models');

exports.getAll = async (req, res) => {
  const subjects = await Subject.findAll({
    where: { UserId: req.userId }
  });
  res.json(subjects);
};

exports.create = async (req, res) => {
  const subject = await Subject.create({
    name: req.body.name,
    description: req.body.description,
    UserId: req.userId
  });
  res.status(201).json(subject);
};

exports.update = async (req, res) => {
  const subject = await Subject.findOne({
    where: { id: req.params.id, UserId: req.userId }
  });

  if (!subject) return res.sendStatus(404);

  await subject.update(req.body);
  res.json(subject);
};

exports.remove = async (req, res) => {
  await Subject.destroy({
    where: { id: req.params.id, UserId: req.userId }
  });
  res.sendStatus(204);
};