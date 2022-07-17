const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
  .then((cards) => {
    res.send(cards)
  })
  .catch((err) => {
    res.send(`Ошибка ${err.message}`)
  })
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
  .then((card) => {
    res.send(card);
  })
  .catch((err) => {
    res.send(`Ошибка ${err.message}`)
  })
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if(card){
      res.send({card});
    } else{
      res.send('Карточка с указанным _id не найдена.')
    }
  })
  .catch((err) => {
    res.send(`Ошибка ${err.message}`)
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
      res.send({ card });
    } else{
      res.send({ message: 'Карточка не найдена' });
    }
  })
  .catch((err) => {
    res.send(`Ошибка ${err.message}`);
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
      res.send({ card });
    } else{
      res.send({ message: 'Карточка не найдена' })
    }
  })
  .catch((err) => {
    res.send(`Ошибка ${err.message}`);
  })
}