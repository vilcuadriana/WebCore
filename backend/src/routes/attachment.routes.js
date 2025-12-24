const router = require('express').Router();
const controller = require('../controllers/attachment.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.get('/note/:noteId', controller.listForNote);
router.post('/note/:noteId', controller.uploadForNote);
router.delete('/:id', controller.remove);

module.exports = router;
