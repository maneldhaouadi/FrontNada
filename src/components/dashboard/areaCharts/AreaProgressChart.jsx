import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AreaCharts.scss";

const AreaProgressChart = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Récupérer le token stocké
  const token = localStorage.getItem("access_token");

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:81/api/v1/bot/global_market/sync_data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data); // Affichez la réponse complète pour vérification

      // Adapter les données reçues au format attendu
      const transformedData = [
        { id: 1, name: "Total Market Cap", value: response.data.totalMarketCap.toLocaleString() },
        { id: 2, name: "24h Volume", value: response.data.total24hVolume.toLocaleString() },
        { id: 3, name: "BTC Dominance", value: response.data.btcDominance }, // Afficher la valeur brute sans %
      ];

      setData(transformedData);
    } catch (err) {
      setError("Failed to fetch market data. Please check your token and try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Market Data Overview</h4>
      </div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? "Loading..." : "Refresh Data"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="progress-bar-list">
        {data ? (
          data.map((item) => (
            <div className="progress-bar-item" key={item.id}>
              <div className="bar-item-info">
                <p className="bar-item-info-name">{item.name}:</p>
                <p className="bar-item-info-value">{item.value}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default AreaProgressChart;
