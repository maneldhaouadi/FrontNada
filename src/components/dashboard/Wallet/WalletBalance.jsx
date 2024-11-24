import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WalletBalance = () => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const userId = localStorage.getItem('user_id');

        if (!token) {
          throw new Error('Missing JWT token. Please log in.');
        }

        if (!userId) {
          throw new Error('User ID is missing in localStorage.');
        }

        const response = await axios.get(`http://localhost:81/api/v1/bot/wallet/balance?user_id=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data !== undefined) {
          setBalance(response.data);
        } else {
          throw new Error('Balance is missing in the response.');
        }
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError("Access denied. You don't have the necessary permissions.");
        } else {
          setError(err.message);
        }
      }
    };

    const fetchTransactions = async () => {
      // Trading-related transactions
      setTransactions([
        { id: 1, description: 'Bought Bitcoin', amount: '-3000 DT', date: '2024-09-20' },
        { id: 2, description: 'Sold Ethereum', amount: '+800 DT', date: '2024-09-19' },
        { id: 3, description: 'Transaction Fee', amount: '-15 DT', date: '2024-09-18' },
      ]);
    };

    fetchBalance();
    fetchTransactions();
  }, []);

  const styles = {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    balanceCard: {
      background: '#fff',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      color: '#333',
      width: '400px',
      marginBottom: '30px',
    },
    balanceAmount: {
      fontSize: '52px',
      fontWeight: 'bold',
      color: '#007bff',
      marginBottom: '10px',
    },
    transactionsContainer: {
      width: '400px',
      background: '#fff',
      padding: '25px',
      borderRadius: '20px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
      marginBottom: '20px',
    },
    transactionItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid #ddd',
      fontSize: '16px',
    },
    button: {
      backgroundColor: '#28a745',
      color: '#fff',
      padding: '15px 30px',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      marginTop: '20px',
      boxShadow: '0 10px 20px rgba(40, 167, 69, 0.4)',
    },
    footer: {
      marginTop: '40px',
      fontSize: '12px',
      color: '#333',
    },
    transactionDate: {
      color: '#999',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.pageContainer}>
      {/* Wallet Balance Card */}
      <div style={styles.balanceCard}>
        <h2>My Balance</h2>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            <p style={styles.balanceAmount}>
              {balance !== null ? `${balance} DT` : 'Loading...'}
            </p>
            <p style={{ fontSize: '16px', color: '#888' }}>Last updated</p>
          </>
        )}
      </div>

      {/* Transactions Section */}
      <div style={styles.transactionsContainer}>
        <h3>Recent Transactions</h3>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction.id} style={styles.transactionItem}>
              <div>
                <span>{transaction.description}</span>
                <p style={styles.transactionDate}>{transaction.date}</p>
              </div>
              <span>{transaction.amount}</span>
            </div>
          ))
        ) : (
          <p>No recent transactions.</p>
        )}
      </div>

      {/* CTA Button */}
      <button style={styles.button}>
        Add Funds
      </button>

      {/* Footer */}
      <div style={styles.footer}>
        <p>Powered by WalletPro - Simplifying your finances</p>
      </div>
    </div>
  );
};

export default WalletBalance;
