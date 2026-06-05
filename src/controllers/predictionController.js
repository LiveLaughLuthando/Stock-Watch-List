const Prediction = require('../models/Prediction');
const { getPrediction } = require('../services/mlService');
const { getCachedStock } = require('../services/cacheService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Generate a new prediction for a stock (analyst only)
// @route   POST /api/predictions/:symbol
// @access  Private (Analyst)
const createPrediction = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  // Fetch historical data from cache to send to ML service
  const stock = await getCachedStock(symbol);
  if (!stock || !stock.historicalData || stock.historicalData.length === 0) {
    res.status(404);
    throw new Error(`No historical data for ${symbol}`);
  }
  // Call ML Flask API
  const mlResult = await getPrediction(symbol, stock.historicalData);
  // Save prediction to database
  const prediction = await Prediction.create({
    userId: req.user._id,
    stockSymbol: symbol.toUpperCase(),
    predictedTrend: mlResult.trend,
    confidence: mlResult.confidence,
    sentiment: mlResult.sentiment
  });
  res.status(201).json({
    symbol: prediction.stockSymbol,
    trend: prediction.predictedTrend,
    confidence: prediction.confidence,
    sentiment: prediction.sentiment,
    createdAt: prediction.createdAt
  });
});

// @desc    Get prediction history for the logged-in user
// @route   GET /api/predictions/history
// @access  Private
const getPredictionHistory = asyncHandler(async (req, res) => {
  const predictions = await Prediction.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(predictions);
});

module.exports = { createPrediction, getPredictionHistory };