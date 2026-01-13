const router = require('express').Router();
const controller = require('../controllers/import.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

// creare import (YouTube / link / text)
router.post('/', controller.create);

// toate importurile utilizatorului
router.get('/', controller.getAll);

// importurile pentru o notiță
router.get('/note/:noteId', controller.getForNote);

// ștergere import
router.delete('/:id', controller.remove);

module.exports = router;
