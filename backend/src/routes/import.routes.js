const router = require('express').Router();
const controller = require('../controllers/import.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.post('/', controller.create);
router.get('/', controller.getAll);

module.exports = router;
