const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-err');
const { BadRequest } = require('../errors/bad-request');
const { Unauthorized } = require('../errors/unauthorized');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Введены некорректные данные');
      }
      return next(err);
    });
};

// Получаем данные авторизованного пользователя
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Введены некорректные данные');
      }
      return next(err);
    });
};

module.exports.postUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash.apply(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        res.send({ user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequest('Переданы некорректные данные при создании пользователя.');
        }
        return next(err);
      }));
};

module.exports.patchProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      } else if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля.');
      }
      next(err);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      } else if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при обновлении аватара.');
      }
      return next(err);
    });
};

// Модуль авторизации
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserbyCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { httpOnly: true });
      res.send({ token });
    })
    .catch(() => {
      throw new Unauthorized('Необходима авторизация');
    });
};
