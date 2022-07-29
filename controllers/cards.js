const Card = require('../models/card');
const { NotFoundError } = require('../errors/not-found-err');
const { BadRequest } = require('../errors/bad-request');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании карточки.');
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (JSON.stringify(req.user._id) !== JSON.stringify(card.owner)) {
        return res.status(500).send('Удаление чужой карточки невозможно');
      }
      if (card) {
        return res.send({ card });
      }
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные при удалении карточки.');
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        throw new NotFoundError({ message: 'Передан несуществующий _id карточки.' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные для постановки лайка.');
      }
      return next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные для постановки лайка.');
      }
      return next(err);
    });
};
