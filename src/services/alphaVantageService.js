const axios = require('axios');
const env = require('../config/env');

const BASE_URL = 'https://www.alphavantage.co/query';

const fetchQuote = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase(),
        apikey: env.ALPHA_VANTAGE_API_KEY
      }
    });
    const quote = response.data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error(`No quote data for ${symbol}`);
    }
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
    };
  } catch (error) {
    console.error('Alpha Vantage quote error:', error.message);
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }
};

const fetchHistorical = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol.toUpperCase(),
        apikey: env.ALPHA_VANTAGE_API_KEY,
        outputsize: 'compact' // last 100 days
      }
    });
    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error(`No historical data for ${symbol}`);
    }
    const historical = Object.entries(timeSeries).map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    }));
    // Return last 30 days for frontend charts
    return historical.slice(0, 30);
  } catch (error) {
    console.error('Alpha Vantage historical error:', error.message);
    throw new Error(`Failed to fetch historical data for ${symbol}`);
  }
};

module.exports = { fetchQuote, fetchHistorical };