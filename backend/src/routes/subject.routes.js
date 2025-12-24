const router = require('express').Router();
const controller = require('../controllers/subject.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
