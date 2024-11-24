import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Coin",
  "Current Price",
  "ATH",
  "ATH Market Cap",
  "Circulating Supply",
  "Total Supply",
  "Max Supply",
  "Action",
];

const AreaTable = () => {
  const [coinData, setCoinData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCoinData();
  }, []);

  useEffect(() => {
    // Créer une expression régulière à partir de la chaîne de recherche
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const queryRegex = new RegExp(normalizedQuery, 'i'); // 'i' pour la recherche insensible à la casse

    setFilteredData(
      coinData.filter(coin =>
        (
          queryRegex.test(coin.coinMarketDataId?.coinId || '') ||
          queryRegex.test((coin.currentPrice || '').toString()) ||
          queryRegex.test((coin.ath || '').toString()) ||
          queryRegex.test((coin.athMc || '').toString()) ||
          queryRegex.test((coin.circulatingSupply || '').toString()) ||
          queryRegex.test((coin.totalSupply || '').toString()) ||
          queryRegex.test((coin.maxSupply || '').toString())
        )
      )
    );
  }, [searchQuery, coinData]);

  const fetchCoinData = async () => {
    const token = localStorage.getItem("access_token");
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:81/api/v1/bot/coin_market_data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoinData(response.data);
    } catch (error) {
      setError("Erreur lors de la récupération des données : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Cryptocurrency Market Data</h4>
        <input
          type="text"
          placeholder="Search by Coin ID or values"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="data-table-diagram">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                {TABLE_HEADS.map((th, index) => (
                  <th key={index}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((coin, index) => (
                  <tr key={index}>
                    <td>{coin.coinMarketDataId?.coinId || 'N/A'}</td>
                    <td>${(coin.currentPrice || 0).toLocaleString()}</td>
                    <td>${(coin.ath || 0).toLocaleString()}</td>
                    <td>${(coin.athMc || 0).toLocaleString()}</td>
                    <td>{(coin.circulatingSupply || 0).toLocaleString()}</td>
                    <td>{(coin.totalSupply || 0).toLocaleString()}</td>
                    <td>{(coin.maxSupply || 0).toLocaleString()}</td>
                    <td className="dt-cell-action">
                      <AreaTableAction />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_HEADS.length}>No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AreaTable;
