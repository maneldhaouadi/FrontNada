import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaBitcoin } from 'react-icons/fa';

// Styles for the UserCoins component
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 25px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #000000; 
  margin-bottom: 20px;
  text-align: left;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
`;

const Alert = styled.p`
  color: red; /* Rouge pour le texte */
  font-weight: bold;
  text-align: center;
  margin: 20px auto;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
`;

const UserCoinListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  color: #2c3e50;
`;

const UserCoinListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #ddd;
  background-color: #ecf0f1;
  margin-bottom: 12px;
  border-radius: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e2e2e2;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CoinName = styled.span`
  font-size: 18px;
  color: #2c3e50;
  display: flex;
  align-items: center;
`;

const Icon = styled(FaBitcoin)`
  color: #f39c12;
  font-size: 24px;
  margin-right: 12px;
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #e74c3c;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }

  &:disabled {
    background-color: #d3d3d3;
    cursor: not-allowed;
  }
`;

const SearchInput = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 25px;
  font-size: 16px;
  width: 100%;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const UserCoins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteMessage, setDeleteMessage] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('access_token');

        if (!userId) {
          setError('User ID is not available in localStorage.');
          setLoading(false);
          return;
        }

        if (!token) {
          setError('No access token found. Please log in.');
          setLoading(false);
          return;
        }

        const url = `http://localhost:81/api/v1/bot/all?userId=${userId}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (Array.isArray(response.data)) {
          setCoins(response.data);
        } else {
          setError('Unexpected response format.');
        }
      } catch (error) {
        console.error('Error:', error);
        if (error.response) {
          setError(`Error: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
          setError('Error: No response received from the server.');
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const handleDelete = async (coinId) => {
    try {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('access_token');

      if (!userId) {
        setError('User ID is not available in localStorage.');
        return;
      }

      if (!token) {
        setError('No access token found. Please log in.');
        return;
      }

      const requestData = {
        userId: parseInt(userId),
        marketDataSourceId: 1,
        coinId: coinId,
      };

      const response = await axios.delete('http://localhost:81/api/v1/bot/remove', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: requestData,
      });

      if (response.status === 200) {
        setCoins((prevCoins) => prevCoins.filter((coin) => coin.userCoinId.coinId !== coinId));
        setError('');
        setDeleteMessage(true);

        // Masquer le message après 3 secondes
        setTimeout(() => {
          setDeleteMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        setError(`Error: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        setError('Error: No response received from the server.');
      } else {
        setError(`Error: ${error.message}`);
      }
    }
  };

  const filteredCoins = coins.filter((coin) =>
    coin.userCoinId.coinId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <MainContainer>
      <Content>
        <Title>Your Coins</Title>
        <Alert visible={deleteMessage}>Coin deleted successfully.</Alert>
        <SearchInput
          type="text"
          placeholder="Search for a coin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <UserCoinListContainer>
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin) => (
              <UserCoinListItem key={coin.userCoinId.coinId}>
                <CoinName>
                  <Icon />
                  {coin.userCoinId.coinId}
                </CoinName>
                <DeleteButton onClick={() => handleDelete(coin.userCoinId.coinId)}>
                  Delete
                </DeleteButton>
              </UserCoinListItem>
            ))
          ) : (
            <p>No coins match your search.</p>
          )}
        </UserCoinListContainer>
      </Content>
    </MainContainer>
  );
};

export default UserCoins;
