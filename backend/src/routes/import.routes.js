const router = require('express').Router();
const controller = require('../controllers/import.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);


// 🔹 import atașat la o notiță EXISTENTĂ  ✅
router.post('/note/:noteId', controller.createForNote);

// 🔹 importuri pentru o notiță
router.get('/note/:noteId', controller.getForNote);

// 🔹 toate importurile utilizatorului
router.get('/', controller.getAll);

// 🔹 ștergere import
router.delete('/:id', controller.remove);

module.exports = router;
