import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import AdminSidebar from '../../sidebar/AdminSideBar'; // Assurez-vous que le chemin d'importation est correct

const FullPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 20px;
  background-color: #ffffff;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 1470px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin: 0 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: left;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border 0.3s;

  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border 0.3s;

  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin: 10px 0;
`;

const SuccessMessage = styled.p`
  color: green;
  text-align: center;
  margin: 10px 0;
`;

const EditUser = () => {
  const { id } = useParams(); // Récupérer l'ID de l'utilisateur depuis l'URL
  const [userData, setUserData] = useState({
    completeName: '',
    username: '',
    status: 'Active',
    roleId: '', // Nouvel état pour le rôle
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:81/api/v1/bot/users/current/${id}`);
        setUserData({
          completeName: response.data.completeName || '',
          username: response.data.username || '',
          status: response.data.status || 'Active',
          roleId: response.data.roleId || '', // Récupérer le rôle actuel de l'utilisateur
        });
      } catch (err) {
        setError(`Failed to fetch user data: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      const updatedUserData = {
        userId: id,
        completeName: userData.completeName,
        username: userData.username,
        status: userData.status,
      };

      // Mettre à jour les informations de l'utilisateur
      const userResponse = await axios.put(`http://localhost:81/api/v1/bot/users/admin/update/${id}`, updatedUserData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mettre à jour le rôle de l'utilisateur
      const roleResponse = await axios.put(`http://localhost:81/api/v1/bot/users/${id}/roles/${userData.roleId}`, null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (userResponse.status === 200 && roleResponse.status === 200) {
        setSuccess('User information and role updated successfully');
      }
    } catch (err) {
      setError(`Failed to update user information or role: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return <FullPageContainer><p>Loading...</p></FullPageContainer>;
  }

  return (
    <FullPageContainer>
      <AdminSidebar />
      <FormContainer>
        <Title>Edit User Information</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="completeName"
              value={userData.completeName}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Status</Label>
            <Select
              name="status"
              value={userData.status}
              onChange={handleInputChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Verification">Verification</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Role</Label>
            <Select
              name="roleId"
              value={userData.roleId}
              onChange={handleInputChange}
              required
            >
              <option value="1">Admin</option>
              <option value="2">User</option>
              {/* Vous pouvez ajouter d'autres rôles ici si nécessaire */}
            </Select>
          </FormGroup>
          <Button type="submit">Update</Button>
        </form>
      </FormContainer>
    </FullPageContainer>
  );
};

export default EditUser;
