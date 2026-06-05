const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stockSymbol: {
    type: String,
    required: true,
    uppercase: true
  },
  predictedTrend: {
    type: String,
    enum: ['Bullish', 'Bearish', 'Neutral'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  sentiment: {
    type: String,
    enum: ['Positive', 'Negative', 'Neutral']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);