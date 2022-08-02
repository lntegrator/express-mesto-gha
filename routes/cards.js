const router = require('express').Router();
const {
  getCards, postCard, deleteCard, likeCard, deleteLike,
} = require('../controllers/cards');
const { validateCardId, validatePostCard } = require('../middlewares/validators');

router.get('/', getCards);
router.post('/', validatePostCard, postCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = router;
