const mongoose = require('mongoose');

const cachedStockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true, unique: true },
  companyName: { type: String },
  latestPrice: { type: Number },
  changePercent: { type: Number },
  historicalData: [
    {
      date: String,
      open: Number,
      high: Number,
      low: Number,
      close: Number,
      volume: Number
    }
  ],
  lastUpdated: { type: Date, default: Date.now }
});

// Index for efficient cleanup
cachedStockSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('CachedStock', cachedStockSchema);