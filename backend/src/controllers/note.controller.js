const { Note } = require('../models');

exports.getAll = async (req, res) => {
  const notes = await Note.findAll({
    where: { UserId: req.userId }
  });
  res.json(notes);
};

exports.getOne = async (req, res) => {
  const note = await Note.findOne({
    where: { id: req.params.id, UserId: req.userId }
  });

  if (!note) return res.sendStatus(404);
  res.json(note);
};

exports.create = async (req, res) => {
  const note = await Note.create({
    title: req.body.title,
    contentMarkdown: req.body.contentMarkdown,
    SubjectId: req.body.subjectId,
    UserId: req.userId
  });
  res.status(201).json(note);
};

exports.update = async (req, res) => {
  const note = await Note.findOne({
    where: { id: req.params.id, UserId: req.userId }
  });

  if (!note) return res.sendStatus(404);

  const { title, contentMarkdown, subjectId } = req.body;

  const patch = {};
  if (title !== undefined) patch.title = title;
  if (contentMarkdown !== undefined) patch.contentMarkdown = contentMarkdown;
  if (subjectId !== undefined) patch.SubjectId = subjectId;

  await note.update(patch);
  res.json(note);
};


exports.remove = async (req, res) => {
  await Note.destroy({
    where: { id: req.params.id, UserId: req.userId }
  });
  res.sendStatus(204);
};