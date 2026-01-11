/**
 * Controller pentru importarea conținutului extern în aplicație.
 * Permite crearea automată de notițe pornind de la:
 *  - link-uri (ex: YouTube)
 *  - text brut introdus de utilizator
 *
 * Pentru link-urile YouTube se utilizează serviciul extern oEmbed
 * pentru preluarea automată a metadatelor (titlu, autor etc.).
 */

const fetch = require('node-fetch');
const { Note, Import, Subject } = require('../models');

/**
 * Detectează tipul sursei pe baza URL-ului.
 *
 * @param {string} url - adresa sursei externe
 * @returns {string} tipul detectat (youtube / link)
 */
function detectType(url) {
  const u = (url || '').toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  return 'link';
}

/**
 * Apelează serviciul extern YouTube oEmbed pentru a obține metadate
 * despre un videoclip (titlu, autor, thumbnail etc.).
 *
 * @param {string} url - URL-ul videoclipului YouTube
 * @returns {Object|null} obiectul oEmbed sau null dacă apelul eșuează
 */
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

/**
 * Creează o notiță nouă pe baza unei surse externe sau a unui text introdus.
 * În funcție de tipul sursei:
 *  - generează automat titlul
 *  - salvează metadate suplimentare
 *  - construiește conținutul notiței în format Markdown
 */
exports.create = async (req, res) => {
  try {
    const { url, rawText, subjectId, type } = req.body;

    // Verifică dacă materia aparține utilizatorului
    if (subjectId) {
      const subject = await Subject.findOne({
        where: { id: subjectId, UserId: req.userId },
      });
      if (!subject) return res.sendStatus(403);
    }

    // Detectează tipul importului dacă nu este specificat explicit
    const finalType = type || detectType(url);

    let title = 'Import';
    let meta = null;

    // Preluare metadate pentru videoclipuri YouTube
    if (finalType === 'youtube' && url) {
      const oembed = await getYoutubeOembed(url);
      if (oembed) {
        title = oembed.title || title;
        meta = oembed;
      } else {
        title = 'YouTube';
      }
    } else if (url) {
      title = 'Link';
    } else {
      title = 'Text';
    }

    // Construirea conținutului notiței în format Markdown
    let contentMarkdown = '## Sursă\n';
    if (url) contentMarkdown += `Link: ${url}\n\n`;
    contentMarkdown += '## Notițe\n';
    if (rawText && rawText.trim()) contentMarkdown += `${rawText.trim()}\n`;

    // Crearea notiței
    const note = await Note.create({
      title,
      contentMarkdown,
      SubjectId: subjectId || null,
      UserId: req.userId,
    });

    // Salvarea informațiilor despre import
    const imp = await Import.create({
      type: finalType,
      url: url || null,
      title,
      rawText: rawText || null,
      metadata: meta,
      UserId: req.userId,
      NoteId: note.id,
    });

    res.status(201).json({ note, import: imp });
  } catch {
    res.sendStatus(500);
  }
};

/**
 * Returnează lista tuturor importurilor realizate de utilizatorul curent.
 */
exports.getAll = async (req, res) => {
  try {
    const items = await Import.findAll({
      where: { UserId: req.userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(items);
  } catch {
    res.sendStatus(500);
  }
};
