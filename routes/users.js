const router = require('express').Router();
const {
  getUsers, getUserById, patchAvatar, patchProfile, getUser,
} = require('../controllers/users');
const { validateUserId, validatePatchAvatar, validatePatchProfile } = require('../middlewares/validators');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validatePatchProfile, patchProfile);
router.patch('/me/avatar', validatePatchAvatar, patchAvatar);

module.exports = router;
