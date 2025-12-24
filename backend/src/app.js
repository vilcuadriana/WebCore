require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const subjectRoutes = require('./routes/subject.routes');
const noteRoutes = require('./routes/note.routes');
const attachmentRoutes = require('./routes/attachment.routes');
const tagRoutes = require('./routes/tag.routes');
const importRoutes = require('./routes/import.routes');
const studyGroupRoutes = require('./routes/studyGroup.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);

app.use('/api/attachments', attachmentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/imports', importRoutes);
app.use('/api/groups', studyGroupRoutes);

module.exports = app;
