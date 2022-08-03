const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Unauthorized = require('../errors/unauthorized');
const Conflict = require('../errors/сonflict');

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
      if (!user) {
        throw new NotFoundError('Пользователя с такими данными не существует');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Введены некорректные данные'));
      }
      next(err);
    });
};

// Получаем данные авторизованного пользователя
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
    })
    .catch(next);
};

// Создаем пользователя
module.exports.postUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => { // eslint-disable-line no-unused-vars
        res.status(200).send({
          data: {
            name, about, avatar, email,
          },
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
        }
        if (err.code === 11000) {
          return next(new Conflict('Данный email уже зарегистрирован.'));
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
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении аватара.'));
      }
      return next(err);
    });
};

// Модуль авторизации
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserbyCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new Unauthorized('Необходима авторизация'));
    });
};
