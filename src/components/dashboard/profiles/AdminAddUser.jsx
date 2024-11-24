import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AdminSidebar from '../../sidebar/AdminSideBar'; // Assurez-vous que le chemin d'importation est correct

// Container and styles for the Add User form
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

const Header = styled.div`
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  padding: 20px 0 20px 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 80px; 
`;

const Title = styled.h2`
  font-size: 24px;
  color: #444;
  font-weight: bold;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  margin-left: 80px; 
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const InfoField = styled.div`
  flex: 1;
  margin: 0 10px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
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
  background-color: #FFA500;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px; 
  margin-top: 20px;

  &:hover {
    background-color: #FF8C00;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 14px;
  text-align: left;
`;

const SuccessMessage = styled.p`
  color: #28a745; /* Green for success */
  font-size: 14px;
  text-align: left;
`;

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [completeName, setCompleteName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Added state for success message
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage(''); // Reset success message

    if (!username || !password || !confirmPassword || !completeName) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    try {
      await axios.post('http://localhost:81/api/v1/bot/users/add', {
        username,
        password,
        completeName,
        status: 'Active',
        rolePayloads: [{ roleId: 2 }]
      });

      setSuccessMessage('User added successfully!'); // Show success message
    } catch (error) {
      console.error('Error signing up:', error.response ? error.response.data : error.message);
      setErrorMessage('Signup failed. Please try again.');
    }
  };

  return (
    <DashboardContainer>
      <AdminSidebar/>
      <Header>
        <Title>Add User</Title>
      </Header>

      <ContentContainer>
        <form onSubmit={handleSignup}>
          <InfoRow>
            <InfoField>
              <Label>Complete Name</Label>
              <Input
                type="text"
                placeholder="Complete Name"
                value={completeName}
                onChange={(e) => setCompleteName(e.target.value)}
                required
              />
            </InfoField>
          </InfoRow>
          <InfoRow>
            <InfoField>
              <Label>Username</Label>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </InfoField>
          </InfoRow>
          <InfoRow>
            <InfoField>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InfoField>
          </InfoRow>
          <InfoRow>
            <InfoField>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </InfoField>
          </InfoRow>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>} {/* Display success message */}
          <Button type="submit">Add User</Button>
        </form>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default AddUser;
