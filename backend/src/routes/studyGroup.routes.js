const router = require('express').Router();
const controller = require('../controllers/studyGroup.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

router.post('/', controller.create);
router.get('/', controller.getMyGroups);

// 🔹 intrare în grup
router.get('/:id', controller.getGroupById);

// 🔹 ștergere grup
router.delete('/:id', controller.deleteGroup);

router.post('/:id/invite', controller.invite);
router.get('/:id/members', controller.getMembers);
router.get('/:id/notes', controller.getGroupNotes);

module.exports = router;
