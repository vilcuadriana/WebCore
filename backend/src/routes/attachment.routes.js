const router = require('express').Router();
const controller = require('../controllers/attachment.controller');

router.get('/note/:noteId', controller.listForNote);
router.post('/note/:noteId', controller.uploadForNote);
router.delete('/:id', controller.remove);

module.exports = router;
