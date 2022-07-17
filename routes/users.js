const router = require('express').Router();
const {
  getUsers, getUserById, postUser, patchAvatar, patchProfile,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userID', getUserById);
router.post('/', postUser);
router.patch('/me', patchProfile);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
