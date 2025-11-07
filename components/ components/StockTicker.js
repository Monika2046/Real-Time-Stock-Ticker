import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StockChart from './StockChart';
import Watchlist from './Watchlist';
import './StockTicker.css';

const API_URL = 'http://localhost:5000/api';

function StockTicker() {
  const [symbol, setSymbol] = useState('');
  const [priceData, setPriceData] = useState({});
  const [selectedStock, setSelectedStock] = useState('');
  const [watchlist, setWatchlist] = useState([]);

  // Fetch the user's watchlist
  const fetchWatchlist = async () => {
    const res = await axios.get(`${API_URL}/watchlist`);
    setWatchlist(res.data.watchlist);
  };

  // Fetch stock prices periodically
  const fetchPriceData = async () => {
    const prices = {};
    for (let stock of watchlist) {
      const res = await axios.get(`${API_URL}/price/${stock}`);
      prices[stock] = res.data.price;
    }
    setPriceData(prices);
  };

  useEffect(() => {
    fetchWatchlist();
    const interval = setInterval(fetchPriceData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [watchlist]);

  // Add new stock to watchlist
  const addToWatchlist = async () => {
    if (symbol.trim()) {
      await axios.post(`${API_URL}/watchlist`, { symbol });
      setSymbol('');
      fetchWatchlist();
    }
  };

  // Remove stock from watchlist
  const removeFromWatchlist = async (stock) => {
    await axios.delete(`${API_URL}/watchlist/${stock}`);
    fetchWatchlist();
  };

  return (
    <div className="dashboard">
      <h1 className="heading">📈 Real-Time Stock Ticker</h1>

      {/* Input for adding stock symbols */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
        <button onClick={addToWatchlist}>Add Stock</button>
      </div>

      {/* Display live prices */}
      <div className="stock-list">
        {watchlist.length === 0 ? (
          <p>No stocks in watchlist. Add some to begin tracking!</p>
        ) : (
          watchlist.map((stock) => (
            <div key={stock} className="stock-card" onClick={() => setSelectedStock(stock)}>
              <span className="symbol">{stock}</span>
              <span className="price">${priceData[stock] || 'Loading...'}</span>
              <button className="remove-btn" onClick={() => removeFromWatchlist(stock)}>✕</button>
            </div>
          ))
        )}
      </div>

      {/* Chart Section */}
      {selectedStock && (
        <div className="chart-container">
          <StockChart symbol={selectedStock} />
        </div>
      )}

      {/* Watchlist Component */}
      <Watchlist watchlist={watchlist} />
    </div>
  );
}

export default StockTicker;
