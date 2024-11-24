import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MainContainer = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center;     
  flex-direction: column; /* Ensure items stack vertically */
  width: 100%;
  height: 100vh;
  background-color: #fafafa;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const SignupForm = styled.form`
  background-color: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px; 
  text-align: center;
  margin-left: -200px; /* Adjust this value as needed to shift left */
`;

const SignupTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-size: 28px; 
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #1b1b2f;
  font-weight: bold;
  font-size: 16px; 
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SignupButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #4c6ef5;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #3b5bdb;
    transform: scale(1.02);
  }
`;

const Message = styled.p`
  margin-top: 15px;
  text-align: center;
  color: ${(props) => (props.success ? 'green' : 'red')};
  font-size: 14px;
`;

const BottomText = styled.div`
  margin-top: 20px;
  font-size: 14px;
  color: #6c757d;

  a {
    color: #4c6ef5;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [completeName, setCompleteName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');

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
        rolePayloads: [{ roleId: 2 }],
      });

      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error.response ? error.response.data : error.message);
      setErrorMessage('Signup failed. Please try again.');
    }
  };

  return (
    <MainContainer>
      <SignupForm onSubmit={handleSignup}>
        <SignupTitle>Sign Up</SignupTitle>

        <FormGroup>
          <Label htmlFor="completeName">Complete Name:</Label>
          <Input
            type="text"
            id="completeName"
            value={completeName}
            onChange={(e) => setCompleteName(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="username">Username:</Label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm Password:</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>

        {errorMessage && <Message>{errorMessage}</Message>}

        <SignupButton type="submit">Sign Up</SignupButton>

        <BottomText>
          Already have an account? <a href="/login">Log in</a>
        </BottomText>
      </SignupForm>
    </MainContainer>
  );
};

export default SignUp;
