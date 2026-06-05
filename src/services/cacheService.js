const CachedStock = require('../models/CachedStock');
const { fetchQuote, fetchHistorical } = require('./alphaVantageService');
const env = require('../config/env');

const getCachedStock = async (symbol) => {
  const cached = await CachedStock.findOne({ symbol: symbol.toUpperCase() });
  const now = new Date();
  const isFresh = cached && (now - cached.lastUpdated) < env.CACHE_TTL_HOURS * 60 * 60 * 1000;
  if (isFresh) {
    console.log(`Cache HIT for ${symbol}`);
    return cached;
  }
  console.log(`Cache MISS for ${symbol}, fetching fresh...`);
  // Fetch fresh data from Alpha Vantage
  const quote = await fetchQuote(symbol);
  const historical = await fetchHistorical(symbol);
  const stockData = {
    symbol: symbol.toUpperCase(),
    companyName: symbol.toUpperCase(), // Alpha Vantage doesn't provide company name in free tier; we can enrich later
    latestPrice: quote.price,
    changePercent: quote.changePercent,
    historicalData: historical,
    lastUpdated: now
  };
  // Update or insert cache
  const updated = await CachedStock.findOneAndUpdate(
    { symbol: symbol.toUpperCase() },
    stockData,
    { upsert: true, new: true }
  );
  return updated;
};

module.exports = { getCachedStock };