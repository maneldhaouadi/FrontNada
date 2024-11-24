import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Styles for the container
const Container = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
`;

// Styles for the header and button container
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

// Styles for the list of reclamations
const ReclamationList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

const ReclamationItem = styled.li`
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.2s; /* Smooth transition effect */

  &:hover {
    transform: scale(1.02); /* Slightly enlarge on hover */
  }
`;

// Styles for subject and description
const Subject = styled.h3`
  margin-bottom: 10px;
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
`;

const Description = styled.p`
  margin-bottom: 15px;
  color: #555;
  font-size: 1rem;
  line-height: 1.4;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: left;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
`;

// Styles for the status and date
const Status = styled.span`
  display: inline-block;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;
  background-color: ${(props) => {
    if (props.status === 'PENDING') return '#ff9800';
    if (props.status === 'IN_PROGRESS') return '#2196f3';
    return '#4caf50';
  }};
`;

const DateSubmitted = styled.p`
  font-size: 0.85rem;
  color: #777;
  margin-top: 10px;
`;

// Style for the response box
const ResponseBox = styled.div.attrs((props) => ({
  hasResponse: undefined,
}))`
  margin-top: 10px;
  padding: 15px;
  background-color: ${(props) => (props.$hasResponse ? '#e0f7fa' : '#fce4ec')};
  border-left: 5px solid ${(props) => (props.$hasResponse ? '#00796b' : '#d32f2f')};
  border-radius: 5px;
  color: ${(props) => (props.$hasResponse ? '#00796b' : '#d32f2f')};
`;

// Style for the search bar
const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

// Style for delete button
const DeleteButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: transparent;
  color: #e57373;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #d32f2f;
  }
`;

// Style for Add Reclamation button
const AddButton = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const ReclamationUser = () => {
  const [reclamations, setReclamations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchReclamations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');
      const response = await axios.get(`http://localhost:81/api/v1/bot/reclamations/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReclamations(response.data);
    } catch (error) {
      console.error('Error fetching reclamations:', error);
      setError('Error fetching reclamations.');
    }
  };

  const deleteReclamation = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.delete(`http://localhost:81/api/v1/bot/reclamations/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        setReclamations(reclamations.filter((reclamation) => reclamation.id !== id));
      }
    } catch (error) {
      console.error('Error deleting reclamation:', error);
      setError('Error deleting the reclamation.');
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  const filteredReclamations = reclamations.filter((reclamation) =>
    reclamation.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <HeaderContainer>
        <Title>Reclamations</Title>
        <Link to="/createReclamation">
          <AddButton>Add Reclamation</AddButton>
        </Link>
      </HeaderContainer>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <SearchBar
        type="text"
        placeholder="Search by subject..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ReclamationList>
        {filteredReclamations.map((reclamation) => (
          <ReclamationItem key={reclamation.id}>
            <Subject>{reclamation.subject}</Subject>
            <Description>{reclamation.description}</Description>
            <Status status={reclamation.status}>{reclamation.status}</Status>
            <ResponseBox $hasResponse={!!reclamation.response}>
              Response: {reclamation.response || 'No response yet.'}
            </ResponseBox>
            <DateSubmitted>Date submitted: {reclamation.date}</DateSubmitted>
            <DeleteButton onClick={() => deleteReclamation(reclamation.id)} aria-label={`Delete ${reclamation.subject}`}>
              <FaTrash />
            </DeleteButton>
          </ReclamationItem>
        ))}
      </ReclamationList>
    </Container>
  );
};

export default ReclamationUser;
