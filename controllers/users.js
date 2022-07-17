const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.status(200).send({users})
  })
  .catch((err) => {
    res.status(500).send({ "message": "Ошибка по умолчанию." })
  })
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
  .then((user) => {
    if(user){
      res.status(200).send({ user });
    }
    else{
      res.status(404).send({ "message": "Пользователь по указанному _id не найден." })
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ "message": "Введены некорректные данные" });
    } else {
      res.status(500).send({ message: "Ошибка по умолчанию." });
    }
  })
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then((user) => {
    res.status(201).send({ user });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ "message": "Переданы некорректные данные при создании пользователя." });
    } else {
      res.status(500).send({ "message": "Ошибка по умолчанию." })
    }
  })
}

module.exports.patchProfile = (req, res) => {
  const { name, about } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
  .then((user) => {
    res.status(200).send({ user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(404).send({ "message": "Пользователь с указанным _id не найден" });
    } else if (err.name === 'ValidationError') {
      res.status(400).send({ "message": "Переданы некорректные данные при обновлении профиля." });
    } else {
      res.status(500).send({ "message": "Ошибка по умолчанию." });
    }
  })
}

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
  .then((user) => {
    res.status(200).send({ user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(404).send({ "message": "Пользователь с указанным _id не найден" });
    } else if (err.name === 'ValidationError') {
      res.status(400).send({ "message": "Переданы некорректные данные при обновлении аватара." });
    } else {
      res.status(500).send({ "message": "Ошибка по умолчанию." });
    }
  })
}