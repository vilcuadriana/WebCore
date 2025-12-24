const router = require('express').Router();
const controller = require('../controllers/studyGroup.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.post('/', controller.create);
router.get('/', controller.getMyGroups);
router.post('/:id/invite', controller.invite);
router.get('/:id/members', controller.getMembers);

module.exports = router;
