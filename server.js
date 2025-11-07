// Import required libraries
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your real API key from Twelve Data or Alpha Vantage
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.twelvedata.com';

// Default route for testing
app.get('/', (req, res) => {
  res.send("Real-Time Stock Ticker Backend Running Successfully!");
});

// Endpoint to fetch real-time stock prices
app.get('/api/price/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  try {
    const response = await axios.get(`${BASE_URL}/price?symbol=${symbol}&apikey=${API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock price' });
  }
});

// Endpoint to fetch intraday time series data for chart visualization
app.get('/api/intraday/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  try {
    const response = await axios.get(
      `${BASE_URL}/time_series?symbol=${symbol}&interval=1min&apikey=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch intraday data' });
  }
});

// Watchlist storage (temporary - can connect to DB later)
let watchlist = [];

// Add stock to watchlist
app.post('/api/watchlist', (req, res) => {
  const { symbol } = req.body;
  if (symbol && !watchlist.includes(symbol.toUpperCase())) {
    watchlist.push(symbol.toUpperCase());
  }
  res.json({ watchlist });
});

// Get watchlist
app.get('/api/watchlist', (req, res) => {
  res.json({ watchlist });
});

// Remove stock from watchlist
app.delete('/api/watchlist/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  watchlist = watchlist.filter(item => item !== symbol);
  res.json({ watchlist });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
