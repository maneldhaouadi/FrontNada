import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa'; 

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f7fa;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 26px;
  color: #000;
  margin-bottom: 25px;
  text-align: left;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
`;

const Alert = styled.p`
  color: ${(props) => (props.type === 'error' ? '#ff4d4d' : '#28a745')};
  font-weight: bold;
  background-color: ${(props) => (props.type === 'error' ? '#f8d7da' : '#d4edda')};
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
`;

const CoinListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  color: #333;
`;

const CoinListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 10px;
  
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const RadioInput = styled.input`
  margin-right: 12px;
`;

const HeartButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.disabled ? '#d3d3d3' : '#ff4d4d')};
  font-size: 26px;
  transition: transform 0.3s ease;

  &:hover {
    transform: ${(props) => (props.disabled ? 'none' : 'scale(1.2)')};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const SearchInput = styled.input`
  margin: 20px 0;
  padding: 12px;
  font-size: 18px;
  width: 100%;
  max-width: 500px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const CoinList = () => {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCoins = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No access token found. Please log in.');
        return;
      }

      const response = await axios.get('http://localhost:81/api/v1/bot/coins/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const coinsData = Array.isArray(response.data) ? response.data : [];
      setCoins(coinsData);
      setFilteredCoins(coinsData);
      setError('');
    } catch (error) {
      setError('Error fetching coins: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddCoin = async (coinId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No access token found. Please log in.');
        return;
      }

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('No user ID found in localStorage.');
        return;
      }

      const userCoinRequest = { userId, coinId };

      await axios.post('http://localhost:81/api/v1/bot/add', userCoinRequest, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess('Coin added successfully!');
      setError('');
      setSelectedCoin('');
    } catch (error) {
      setError('Error adding coin: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = coins.filter((coin) =>
      coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query)
    );
    setFilteredCoins(filtered);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <MainContainer>
      <Content>
        <Title>Your Coins</Title>
        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}
        <SearchInput
          type="text"
          placeholder="Search for a coin..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <CoinListContainer>
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin) => (
              <CoinListItem key={coin.coinId}>
                <div>
                  <RadioInput
                    type="radio"
                    name="coin"
                    value={coin.coinId}
                    checked={selectedCoin === coin.coinId}
                    onChange={() => setSelectedCoin(coin.coinId)}
                  />
                  {coin.symbol} - {coin.name}
                </div>
                <HeartButton
                  onClick={() => handleAddCoin(coin.coinId)}
                  disabled={selectedCoin !== coin.coinId}
                >
                  <FaHeart />
                </HeartButton>
              </CoinListItem>
            ))
          ) : (
            <p>No coins available.</p>
          )}
        </CoinListContainer>
      </Content>
    </MainContainer>
  );
};

export default CoinList;
