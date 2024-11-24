import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;  
  justify-content: flex-start;  
  width: 100vw;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 20px 40px;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
`;

const Title = styled.h1`
  font-size: 26px;
  color: #000;
  margin-bottom: 25px;
  text-align: left;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
`;

const SuccessMessage = styled.p`
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  margin-top: 10px;
`;

const BoxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 10px;
`;

const Box = styled.div`
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
`;

const Label = styled.label`
  font-size: 16px;
  color: #666;
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: #fafafa;
`;

const Button = styled.button`
  padding: 10px 20px; 
  background-color: orange; 
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px; 
  margin-top: 20px;

  &:hover {
    background-color: #e57c00; 
  }
`;

const ModifierUtilisateur = () => {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newCompleteName, setNewCompleteName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const apiUrl = `http://localhost:81/api/v1/bot/users/current/${id}`;
    axios.get(apiUrl, { headers: { 'Accept': 'application/json' } })
      .then(response => {
        setUser(response.data);
        setNewUsername(response.data.username);
        setNewCompleteName(response.data.completeName);
      })
      .catch(err => setError(err.message));
  }, [id]);

  const handleUpdate = () => {
    const updateUrl = `http://localhost:81/api/v1/bot/users/update/${id}`;
    axios.put(updateUrl, { username: newUsername, password: newPassword, completeName: newCompleteName }, { headers: { 'Content-Type': 'application/json' } })
      .then(() => {
        setSuccessMessage('User updated successfully');
        setError(null);
      })
      .catch(err => setError('Error: ' + err.message));
  };

  if (!user) return <DashboardContainer>Loading...</DashboardContainer>;
  if (error) return <DashboardContainer><p style={{ color: 'red' }}>{error}</p></DashboardContainer>;

  return (
    <DashboardContainer>
      <ContentContainer>
        <Title>Edit User</Title>
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        <BoxContainer>
          <BoxWrapper>
            <Label>Full Name</Label>
            <Input value={newCompleteName} onChange={(e) => setNewCompleteName(e.target.value)} />
          </BoxWrapper>
        </BoxContainer>
        <BoxContainer>
          <BoxWrapper>
            <Label>Username</Label>
            <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          </BoxWrapper>
        </BoxContainer>
        <BoxContainer>
          <BoxWrapper>
            <Label>Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </BoxWrapper>
        </BoxContainer>
        <Button onClick={handleUpdate}>Update User</Button>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default ModifierUtilisateur;
