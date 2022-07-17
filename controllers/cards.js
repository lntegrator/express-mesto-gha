const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
  .then((cards) => {
    res.status(200).send(cards)
  })
  .catch((err) => {
    res.status(500).send({ "message": "Ошибка по умолчанию."})
  })
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
  .then((card) => {
    res.status(201).send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ "message": "Переданы некорректные данные при создании карточки." });
    } else {
      res.status(500).send({ "message": "Ошибка по умолчанию." });
    }
  })
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if(card){
      res.status(200).send({card});
    } else{
      res.status(404).send({ "message": "Карточка с указанным _id не найдена."})
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ "message": "Переданы некорректные данные при удалении карточки." });
    } else {
      res.status(500).send({ "message": "Ошибка по умолчанию." });
    }
  })
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
  .then((card) => {
    if(card){
      res.status(200).send({ card });
    } else{
      res.status(404).send({ "message": "Передан несуществующий _id карточки." });
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ "message": "Переданы некорректные данные для постановки лайка." });
    } else {
      res.status(500).send({ "message": "Ошибка по умолчанию." });
    }
  })
}

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
  .then((card) => {
    if (card){
      res.status(200).send({ card });
    } else{
      res.status(404).send({ "message": "Передан несуществующий _id карточки." })
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ "message": "Переданы некорректные данные для постановки лайка." });
    } else {
      res.status(500).send({ "message": "Ошибка по умолчанию." });
    }
  })
}