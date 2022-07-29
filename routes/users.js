const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, patchAvatar, patchProfile, getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userID', celebrate({
  params: Joi.object().keys({
    userdId: Joi.string().hex().length(24),
  }),
}), getUserById);
router.patch('/me', patchProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^https?:\/\/[www.]?\S/i),
  }),
}), patchAvatar);
router.get('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(30),
    about: Joi.string().required().min(3).max(30),
  }),
}), getUser);

module.exports = router;
