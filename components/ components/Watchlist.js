import React from 'react';
import './Watchlist.css';

function Watchlist({ watchlist }) {
  return (
    <div className="watchlist-container">
      <h3>📋 Watchlist</h3>
      {watchlist.length === 0 ? (
        <p>No stocks added yet.</p>
      ) : (
        <ul>
          {watchlist.map((stock) => (
            <li key={stock}>{stock}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Watchlist;
