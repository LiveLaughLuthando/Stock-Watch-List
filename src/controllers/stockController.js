const { getCachedStock } = require('../services/cacheService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Search stock by symbol and get latest quote + historical
// @route   GET /api/stocks/search?symbol=AAPL
// @access  Private
const searchStock = asyncHandler(async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) {
    res.status(400);
    throw new Error('Symbol query parameter is required');
  }
  const stock = await getCachedStock(symbol);
  res.json({
    symbol: stock.symbol,
    companyName: stock.companyName,
    latestPrice: stock.latestPrice,
    changePercent: stock.changePercent,
    lastUpdated: stock.lastUpdated
  });
});

// @desc    Get historical data for a symbol (used for charting)
// @route   GET /api/stocks/:symbol/history
// @access  Private
const getHistory = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const stock = await getCachedStock(symbol);
  res.json({
    symbol: stock.symbol,
    historical: stock.historicalData
  });
});

// @desc    Get current quote (latest price)
// @route   GET /api/stocks/:symbol/quote
// @access  Private
const getQuote = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const stock = await getCachedStock(symbol);
  res.json({
    symbol: stock.symbol,
    price: stock.latestPrice,
    changePercent: stock.changePercent
  });
});

module.exports = { searchStock, getHistory, getQuote };