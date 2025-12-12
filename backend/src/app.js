require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const subjectRoutes = require('./routes/subject.routes');
const noteRoutes = require('./routes/note.routes');
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(authMiddleware);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', noteRoutes);

module.exports = app;