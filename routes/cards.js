const router = require('express').Router();
const {
  getCards, postCard, deleteCard, likeCard, deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', postCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
