const path = require('path');
const multer = require('multer');
const { Attachment, Note } = require('../models');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
    filename: (req, file, cb) => {
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
        cb(null, name);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});

exports.uploadForNote = [
    upload.single('file'),
    async (req, res) => {
        try {
            const noteId = Number(req.params.noteId);


            const note = await Note.findOne({ where: { id: noteId, UserId: req.userId } });
            if (!note) return res.status(404).json({ message: 'Notița nu există' });

            if (!req.file) return res.status(400).json({ message: 'Nu ai trimis fișier' });

            const att = await Attachment.create({
                originalName: req.file.originalname,
                storedName: req.file.filename,
                mimeType: req.file.mimetype,
                size: req.file.size,
                NoteId: noteId,
                UserId: req.userId,
            });

            res.status(201).json(att);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Eroare la upload' });
        }
    },
];

exports.listForNote = async (req, res) => {
    try {
        const noteId = Number(req.params.noteId);

        const note = await Note.findOne({ where: { id: noteId, UserId: req.userId } });
        if (!note) return res.status(404).json({ message: 'Notița nu există' });

        const items = await Attachment.findAll({
            where: { NoteId: noteId, UserId: req.userId },
            order: [['createdAt', 'DESC']],
        });

        res.json(items.map(a => ({
            ...a.toJSON(),
            url: `http://localhost:4000/uploads/${a.storedName}`,
        })));
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Eroare la listare atașamente' });
    }
};

exports.remove = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const att = await Attachment.findOne({ where: { id, UserId: req.userId } });
        if (!att) return res.status(404).json({ message: 'Atașamentul nu există' });

        await att.destroy();
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Eroare la ștergere atașament' });
    }
};
