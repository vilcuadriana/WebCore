const router = require('express').Router();
const controller = require('../controllers/note.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.get('/', controller.getAll);
router.get('/shared/with-me', controller.getSharedWithMe);
router.get('/:id', controller.getOne);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

router.post('/:id/tags', controller.addTags);
router.get('/:id/tags', controller.getTags);

router.post('/:id/share', controller.share);

module.exports = router;
