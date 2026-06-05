const axios = require('axios');
const env = require('../config/env');

const getPrediction = async (symbol, historicalData) => {
  try {
    // Prepare payload for Flask ML API
    const payload = {
      symbol: symbol.toUpperCase(),
      historical_prices: historicalData.map(day => day.close)
    };
    const response = await axios.post(env.ML_API_URL, payload, {
      timeout: 10000  // 10 seconds
    });
    // Expected response: { trend, confidence, sentiment }
    return {
      trend: response.data.trend || 'Neutral',
      confidence: response.data.confidence || 0,
      sentiment: response.data.sentiment || 'Neutral'
    };
  } catch (error) {
    console.error('ML API error:', error.message);
    // Fallback prediction if ML service is down
    return {
      trend: 'Neutral',
      confidence: 50,
      sentiment: 'Neutral'
    };
  }
};

module.exports = { getPrediction };