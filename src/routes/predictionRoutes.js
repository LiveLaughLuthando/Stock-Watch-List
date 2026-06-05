const express = require('express');
const { createPrediction, getPredictionHistory } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/:symbol', protect, authorizeRoles('analyst'), createPrediction);
router.get('/history', protect, getPredictionHistory);

module.exports = router;