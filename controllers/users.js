const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.send({users})
  })
  .catch((err) => {
    res.status(500).send({message: `Произошла ошибка ${err.message}`})
  })
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
  .then((user) => {
    if(user){
      res.send({ user });
    }
    else{
      res.send('Такого чувака нет.')
    }
  })
  .catch((err) => {
    console.log(`Ошибка ${err.message}`)
  })
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then((user) => {
    res.send({user});
  })
  .catch((err) => {
    console.log(`Ошибка ${err.message}`)
  })
}

module.exports.patchProfile = (req, res) => {
  const { name, about } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true })
  .then((user) => {
    res.send({ user });
  })
  .catch((err) => {
    res.send(`Ошибка ${err.message}`)
  })
}

module.exports.patchAvatar = (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true })
  .then((user) => {
    res.send({ user });
  })
  .catch((err) => {
    res.send(`Ошибка ${err.message}`)
  })
}