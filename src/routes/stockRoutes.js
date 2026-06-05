const express = require('express');
const { searchStock, getHistory, getQuote } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search', protect, searchStock);
router.get('/:symbol/history', protect, getHistory);
router.get('/:symbol/quote', protect, getQuote);

module.exports = router;