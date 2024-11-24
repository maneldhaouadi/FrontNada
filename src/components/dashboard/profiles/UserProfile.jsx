import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Container and styles for the dashboard
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

const WelcomeMessage = styled.div`
  font-size: 24px;
  color: #444;
  font-weight: bold;
`;

const UserAvatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AvatarIcon = styled.img`
  width: 40px;
  height: 40px;
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
  pointer-events: none; /* Disables user interaction */
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
  margin-right: 15px;

  &:hover {
    background-color: #e57c00; /* Darker shade for hover effect */
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
`;

const CheckboxContainer = styled.div`
  margin-bottom: 20px;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #333;
`;

const TwoFactorSection = styled.div`
  margin-top: 30px;
  padding: 10px; /* Reduced padding */
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f0f0f0;
`;

const TwoFactorTitle = styled.h3`
  margin: 0 0 10px;
  color: #444;
  font-size: 18px; /* Adjusted font size */
`;

const TwoFactorInfo = styled.p`
  color: #555;
  font-size: 14px; /* Adjusted font size */
`;

const ClaimsSection = styled.div`
  margin-top: 20px;
  padding: 10px; /* Reduced padding */
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f0f0f0;
`;

const ClaimsTitle = styled.h3`
  margin: 0 0 10px;
  color: #444;
  font-size: 18px; /* Adjusted font size */
`;

const ClaimItem = styled.div`
  margin: 5px 0;
  color: #333;
  font-size: 14px; /* Adjusted font size */
`;

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      axios.get(`http://localhost:81/api/v1/bot/users/current/${storedUserId}`)
        .then(response => setUser(response.data))
        .catch(err => setError(err.message));
    }
  }, []);

  const handleModify = () => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      navigate(`/EditUser/${storedUserId}`);
    } else {
      alert('User ID not found.');
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const storedUserId = localStorage.getItem('user_id');
    if (!isConfirmed) {
      alert('Please confirm by checking the box.');
      return;
    }
    const deleteUrl = `http://localhost:81/api/v1/bot/users/delete/${storedUserId}`;
    axios.delete(deleteUrl)
      .then(() => {
        alert('Account successfully deleted');
        navigate('/login');
      })
      .catch(err => setError('Error: ' + err.message));
  };

  const closeModal = () => {
    setShowDeleteModal(false);
    setIsConfirmed(false);
  };

  if (!user) return <DashboardContainer>Loading...</DashboardContainer>;
  if (error) return <DashboardContainer><p style={{ color: 'red' }}>{error}</p></DashboardContainer>;

  return (
    <DashboardContainer>
      {/* Header */}
      <Header>
        <WelcomeMessage>Your Profile</WelcomeMessage>
        <UserAvatar>
          <AvatarIcon src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Default User Icon" />
        </UserAvatar>
      </Header>

      {/* User Info Section */}
      <ContentContainer>
        <InfoRow>
          <InfoField>
            <Label>Full Name</Label>
            <Input value={user.completeName} readOnly />
          </InfoField>
          <InfoField>
            <Label>Username</Label>
            <Input value={user.username} readOnly />
          </InfoField>
        </InfoRow>

        <InfoRow>
          <InfoField>
            <Label>Password</Label>
            <Input type="password" value={user.decryptedPassword || ""} readOnly />
          </InfoField>
        </InfoRow>

        {/* Static Fields for Additional User Info */}
        <InfoRow>
          <InfoField>
            <Label>Country</Label>
            <Input value="Tunisia" readOnly />
          </InfoField>
          <InfoField>
            <Label>Phone Number</Label>
            <Input value="123-456-7890" readOnly /> {/* Replace with actual phone number if available */}
          </InfoField>
        </InfoRow>

        {/* Buttons for editing and deleting profile */}
        <div style={{ display: 'flex', marginTop: '30px' }}>
          <Button onClick={handleModify}>Edit Profile</Button>
          <DeleteButton onClick={handleDelete}>Delete Profile</DeleteButton>
        </div>

        {/* Two-Factor Authentication Section */}
        <TwoFactorSection>
          <TwoFactorTitle>Two-Factor Authentication</TwoFactorTitle>
          <TwoFactorInfo>
            Enable two-factor authentication for enhanced security. You can set it up via your account settings.
          </TwoFactorInfo>
        </TwoFactorSection>

        {/* Claims Section */}
        <ClaimsSection>
          <ClaimsTitle>Claims</ClaimsTitle>
          {user.claims && user.claims.map((claim, index) => (
            <ClaimItem key={index}>{claim}</ClaimItem>
          ))}
        </ClaimsSection>
      </ContentContainer>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>Confirm Account Deletion</ModalTitle>
            <CheckboxContainer>
              <input
                type="checkbox"
                id="confirmCheckbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
              <CheckboxLabel htmlFor="confirmCheckbox">
                I confirm that I want to delete my account
              </CheckboxLabel>
            </CheckboxContainer>
            <Button onClick={confirmDelete}>Delete My Account</Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalContainer>
        </ModalOverlay>
      )}
    </DashboardContainer>
  );
};

export default UserDashboard;
