import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Container and styles for the reclamation form
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: #fafafa;
  resize: none; /* Disable resizing */
`;

const Button = styled.button`
  padding: 10px 20px; 
  background-color: orange; /* Change button color to orange */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px; 
  margin-top: 20px;

  &:hover {
    background-color: #e57c00; /* Darker shade for hover effect */
  }
`;

const SuccessMessage = styled.div`
  color: green;
  margin-top: 20px;
`;

const CreateReclamation = () => {
  const [reclamationDetails, setReclamationDetails] = useState({ subject: '', description: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null); // État pour les erreurs
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReclamationDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('user_id'); 
    const token = localStorage.getItem('access_token');

    if (!userId || !token) {
      setError("User ID or Access Token is missing. Please log in.");
      return;
    }

    const { subject, description } = reclamationDetails; // Déstructure les détails de la réclamation

    try {
      const url = `http://localhost:81/api/v1/bot/reclamations/create?userId=${userId}&subject=${encodeURIComponent(subject)}&description=${encodeURIComponent(description)}`;

      const response = await axios.post(url, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      setSuccessMessage("Reclamation sent successfully!");
      setError(null); // Réinitialiser l'erreur
      setReclamationDetails({ subject: '', description: '' }); // Réinitialiser le formulaire
    } catch (err) {
      setError("Error sending reclamation: " + err.message); // Gestion des erreurs
      setSuccessMessage(''); // Réinitialiser le message de succès
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Create Reclamation</Title>
      </Header>

      <ContentContainer>
        <form onSubmit={handleSubmit}>
          <InfoRow>
            <InfoField>
              <Label>Subject</Label>
              <Input 
                type="text" 
                name="subject" 
                value={reclamationDetails.subject} 
                onChange={handleChange} 
                required 
              />
            </InfoField>
          </InfoRow>
          <InfoRow>
            <InfoField>
              <Label>Description</Label>
              <TextArea 
                name="description" 
                rows="5" 
                value={reclamationDetails.description} 
                onChange={handleChange} 
                required 
              />
            </InfoField>
          </InfoRow>
          <Button type="submit">Submit Reclamation</Button>
        </form>

        {/* Afficher le message de succès si présent */}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        
        {/* Afficher l'erreur si présente */}
        {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}
      </ContentContainer>
    </DashboardContainer>
  );
};

export default CreateReclamation;
