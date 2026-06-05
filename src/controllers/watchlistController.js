const Watchlist = require('../models/Watchlist');
const { getCachedStock } = require('../services/cacheService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user's watchlist with live prices
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = asyncHandler(async (req, res) => {
  let watchlist = await Watchlist.findOne({ userId: req.user._id });
  if (!watchlist) {
    watchlist = await Watchlist.create({ userId: req.user._id, stocks: [] });
  }
  // Enrich each stock with latest data from cache
  const enrichedStocks = await Promise.all(
    watchlist.stocks.map(async (item) => {
      try {
        const stockData = await getCachedStock(item.symbol);
        return {
          symbol: item.symbol,
          addedAt: item.addedAt,
          latestPrice: stockData.latestPrice,
          changePercent: stockData.changePercent
        };
      } catch {
        return { symbol: item.symbol, addedAt: item.addedAt, latestPrice: null };
      }
    })
  );
  res.json(enrichedStocks);
});

// @desc    Add stock to watchlist
// @route   POST /api/watchlist/add
// @access  Private
const addToWatchlist = asyncHandler(async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) {
    res.status(400);
    throw new Error('Symbol is required');
  }
  let watchlist = await Watchlist.findOne({ userId: req.user._id });
  if (!watchlist) {
    watchlist = await Watchlist.create({ userId: req.user._id, stocks: [] });
  }
  const exists = watchlist.stocks.some(s => s.symbol === symbol.toUpperCase());
  if (exists) {
    res.status(400);
    throw new Error('Stock already in watchlist');
  }
  watchlist.stocks.push({ symbol: symbol.toUpperCase() });
  await watchlist.save();
  res.status(201).json({ message: 'Stock added to watchlist', symbol });
});

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/:symbol
// @access  Private
const removeFromWatchlist = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const watchlist = await Watchlist.findOne({ userId: req.user._id });
  if (!watchlist) {
    res.status(404);
    throw new Error('Watchlist not found');
  }
  watchlist.stocks = watchlist.stocks.filter(s => s.symbol !== symbol.toUpperCase());
  await watchlist.save();
  res.json({ message: 'Stock removed from watchlist', symbol });
});

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };