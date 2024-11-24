import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa'; 
import AdminSidebar from '../../sidebar/AdminSideBar'; 

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f5f7;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  color: #333;
  overflow-y: auto;
  background-color: #ffffff;
`;

const PageContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #333;
  display: flex;
  flex-direction: column; /* Stack children vertically */
`;

const Title = styled.h1`
  color: #1b1b2f;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  flex-grow: 1; /* Allow the title to grow and take available space */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Align items to the right */
  margin-bottom: 20px;
`;

const AddUserButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px; /* Reduced padding */
  font-size: 14px; /* Reduced font size */
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #218838;
  }

  svg {
    margin-right: 3px; /* Reduced margin */
  }
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
`;

const UserListItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
  width: 100%;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const UserName = styled.div`
  color: #4a4a4a;
  font-weight: 500;
  font-size: 16px;
  width: 250px; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
`;

const StatusContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const StatusLabel = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: ${props => (props.status === 'Suspended' ? 'red' : 'green')};
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => (props.status === 'Suspended' ? 'red' : 'green')};
    margin-right: 8px;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${props => props.color || '#333'};
  font-size: ${props => props.size || '18px'};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.hoverColor || '#000'};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const CancelButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:81/api/v1/bot/users/all')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (id) => {
    navigate(`/update-user/${id}`);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
  };

  const handleDeleteConfirm = () => {
    axios.delete(`http://localhost:81/api/v1/bot/users/delete/${selectedUser.userId}`)
      .then(() => {
        setUsers(users.filter(user => user.userId !== selectedUser.userId));
        setSelectedUser(null);
      })
      .catch(error => {
        console.error('There was an error deleting the user!', error);
      });
  };

  const handleDeleteCancel = () => {
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    navigate('/AdminAddUser'); // Updated to navigate to the desired path
  };

  return (
    <MainContainer>
      <AdminSidebar />
      <Content>
        <PageContainer>
          <ButtonContainer>
            <AddUserButton onClick={handleAddUser}>
              <FaPlus /> Add User
            </AddUserButton>
          </ButtonContainer>
          <Title>Admin Dashboard</Title>
          <SearchInput
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <UserList>
            {filteredUsers.map(user => (
              <UserListItem key={user.userId}>
                <UserInfo>
                  <UserName>{user.username}</UserName>
                  <StatusContainer>
                    <StatusLabel status={user.status}>
                      {user.status}
                    </StatusLabel>
                  </StatusContainer>
                </UserInfo>
                <ActionContainer>
                  <ActionButton onClick={() => handleEditClick(user.userId)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton color="red" onClick={() => handleDeleteClick(user)}>
                    <FaTrashAlt />
                  </ActionButton>
                </ActionContainer>
              </UserListItem>
            ))}
          </UserList>
        </PageContainer>
        {selectedUser && (
          <ModalOverlay>
            <ModalContainer>
              <ModalTitle>Are you sure you want to delete this user?</ModalTitle>
              <ModalButtons>
                <ConfirmButton onClick={handleDeleteConfirm}>Yes</ConfirmButton>
                <CancelButton onClick={handleDeleteCancel}>No</CancelButton>
              </ModalButtons>
            </ModalContainer>
          </ModalOverlay>
        )}
      </Content>
    </MainContainer>
  );
};

export default AdminDashboard;
