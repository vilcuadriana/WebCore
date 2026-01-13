const fetch = require('node-fetch');
const { Note, Import, Subject } = require('../models');

function detectType(url) {
  const u = (url || '').toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  return 'link';
}

async function getYoutubeOembed(url) {
  try {
    const endpoint = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(
      url
    )}`;
    const resp = await fetch(endpoint);
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

exports.create = async (req, res) => {
  try {
    const { url, rawText, subjectId } = req.body;

    if (subjectId) {
      const subject = await Subject.findOne({
        where: { id: subjectId, UserId: req.userId },
      });
      if (!subject) return res.sendStatus(403);
    }

    const type = detectType(url);
    let title = 'Import';
    let meta = null;

    if (type === 'youtube' && url) {
      const oembed = await getYoutubeOembed(url);
      if (oembed) {
        title = oembed.title;
        meta = oembed;
      }
    } else if (url) {
      title = 'Link';
    } else {
      title = 'Text';
    }

    let contentMarkdown = '## Sursă\n';
    if (url) contentMarkdown += `${url}\n\n`;
    contentMarkdown += '## Notițe\n';
    if (rawText) contentMarkdown += rawText;

    const note = await Note.create({
      title,
      contentMarkdown,
      SubjectId: subjectId || null,
      UserId: req.userId,
    });

    const imp = await Import.create({
      type,
      url: url || null,
      title,
      rawText: rawText || null,
      metadata: meta,
      UserId: req.userId,
      NoteId: note.id,
    });

    res.status(201).json({ note, import: imp });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.getAll = async (req, res) => {
  const items = await Import.findAll({
    where: { UserId: req.userId },
    order: [['createdAt', 'DESC']],
  });
  res.json(items);
};

exports.getForNote = async (req, res) => {
  const items = await Import.findAll({
    where: {
      NoteId: req.params.noteId,
      UserId: req.userId,
    },
    order: [['createdAt', 'DESC']],
  });
  res.json(items);
};

exports.remove = async (req, res) => {
  const imp = await Import.findOne({
    where: { id: req.params.id, UserId: req.userId },
  });
  if (!imp) return res.sendStatus(404);

  await imp.destroy();
  res.sendStatus(204);
};
