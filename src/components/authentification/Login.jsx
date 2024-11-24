import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MainContainer = styled.div`
  display: flex;
  justify-content: flex-start;  // Align items to the left
  align-items: center; 
  width: 100%;
  height: 100vh;
  background-color: #fafafa;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  padding-top: 2px; // Add some top padding to move the form higher
`;

const LoginForm = styled.form`
  background-color: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px; 
  text-align: center;
  margin-left: 380px; // Move form a bit to the left
`;

const LoginTitle = styled.h2`
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

const LoginButton = styled.button`
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

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        'http://localhost:81/api/v1/bot/users/login',
        null,
        {
          params: {
            username,
            password,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, refresh_token, user_id } = response.data;

      // Stocker les tokens et l'ID utilisateur dans le localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_id', user_id);

      // Récupérer le statut de l'utilisateur
      const statusResponse = await axios.get(`http://localhost:81/api/v1/bot/users/${user_id}/status`);
      const userStatus = statusResponse.data;

      // Vérifier le statut de l'utilisateur
      if (userStatus === "Active") {
        // Récupérer le rôle de l'utilisateur
        const roleResponse = await axios.get(`http://localhost:81/api/v1/bot/users/${user_id}/role`);
        const userRole = roleResponse.data;

        // Redirection en fonction du rôle
        if (userRole === 1) {
          navigate('/AdminProfile');
        } else if (userRole === 2) {
          navigate('/dashboard');
        } else {
          setError('Rôle utilisateur invalide');
        }

        setSuccess('Connexion réussie !');
      } else if (userStatus === "Suspended") {
        setError('Vous êtes bloqué à cause de votre statut. Veuillez contacter l\'administrateur.');
      } else {
        setError('Statut de l\'utilisateur inconnu.');
      }

    } catch (err) {
      console.error('Erreur de connexion:', err.response ? err.response.data : err.message);
      setError('Échec de la connexion. Veuillez vérifier vos informations.');
    }
  };

  return (
    <MainContainer>
      <LoginForm onSubmit={handleLogin}>
        <LoginTitle>Login</LoginTitle>

        <FormGroup>
          <Label htmlFor="username">Email:</Label>
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
          <Input type="checkbox" id="rememberMe" />
          <Label htmlFor="rememberMe" style={{ display: 'inline', marginLeft: '8px' }}>
            Remember Me
          </Label>
        </FormGroup>

        <LoginButton type="submit">Login</LoginButton>

        {error && <Message>{error}</Message>}
        {success && <Message success>{success}</Message>}

        <BottomText>
          <a href="/forgot-password">Forgot Password?</a>
        </BottomText>

        <BottomText>
          Not registered yet? <a href="/signup">Create an account</a>
        </BottomText>
      </LoginForm>
    </MainContainer>
  );
};

export default Login;
