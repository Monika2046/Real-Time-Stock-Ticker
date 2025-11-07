import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const API_URL = 'http://localhost:5000/api';

function StockChart({ symbol }) {
  const [chartData, setChartData] = useState({});

  const fetchChartData = async () => {
    const res = await axios.get(`${API_URL}/intraday/${symbol}`);
    const data = res.data?.values?.slice(0, 30).reverse(); // Last 30 data points
    const labels = data.map((item) => item.datetime);
    const prices = data.map((item) => parseFloat(item.close));

    setChartData({
      labels,
      datasets: [
        {
          label: `${symbol} Price (USD)`,
          data: prices,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.3,
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    });
  };

  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div>
      <h2>{symbol} - Live Chart</h2>
      {chartData.labels ? <Line data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
}

export default StockChart;
