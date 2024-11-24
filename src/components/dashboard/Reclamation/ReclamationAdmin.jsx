import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';
import AdminSideBar from "../../sidebar/AdminSideBar";

const TableContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 15px;
  background-color: #f1f1f1;
  text-align: left;
  border-bottom: 2px solid #ddd;
  font-weight: bold;
`;

const TableRow = styled.tr`
  background-color: #fff;
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ddd;
  text-align: left;
`;

const StatusButton = styled.span`
  padding: 8px 12px;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  background-color: ${(props) => {
    if (props.status === 'PENDING') return '#ff9800';
    if (props.status === 'IN_PROGRESS') return '#2196f3';
    return '#4caf50';
  }};
`;

const ResponseContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const ResponseInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 70%;
  font-size: 14px;
  margin-right: 10px;
`;

const SubmitButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: red;
  font-size: 20px;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState([]);
  const [error, setError] = useState('');
  const [responses, setResponses] = useState({});
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchReclamations = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:81/api/v1/bot/reclamations/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReclamations(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Your session has expired. Please log in again.');
        // Optionally redirect the user to the login page
      } else {
        setError('Error retrieving the reclamations.');
      }
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  const showMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const updateReclamationStatus = async (id, newStatus) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`http://localhost:81/api/v1/bot/reclamations/update-status/${id}`, null, {
        params: { status: newStatus },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReclamations();
      showMessage('Status updated successfully');
    } catch (error) {
      setError('Error updating the status.');
    }
  };

  const handleResponseChange = (id, text) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [id]: text,
    }));
  };

  const respondToReclamation = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`http://localhost:81/api/v1/bot/reclamations/respond/${id}`, null, {
        params: { response: responses[id] },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReclamations();
      setResponses((prevResponses) => ({ ...prevResponses, [id]: '' }));
      showMessage('Response sent successfully');
    } catch (error) {
      setError('Error sending the response.');
    }
  };

  const deleteReclamation = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://localhost:81/api/v1/bot/reclamations/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReclamations();
      showMessage('Reclamation deleted successfully');
    } catch (error) {
      setError('Error deleting the reclamation.');
    }
  };

  const filteredReclamations = reclamations.filter((reclamation) =>
    reclamation.subject.toLowerCase().includes(search.toLowerCase()) ||
    reclamation.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AdminSideBar />
      <TableContainer>
        <h2>Reclamation List</h2>
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        <input
          type="text"
          placeholder="Search by subject or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: '20px', padding: '8px', width: '100%' }}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Table>
          <thead>
            <tr>
              <TableHeader>Subject</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Username</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Change Status</TableHeader>
              <TableHeader>Respond</TableHeader>
              <TableHeader>Delete</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredReclamations.map((reclamation) => (
              <TableRow key={reclamation.id}>
                <TableCell>{reclamation.subject}</TableCell>
                <TableCell>{reclamation.description}</TableCell>
                <TableCell>{reclamation.date}</TableCell>
                <TableCell>{reclamation.username}</TableCell>
                <TableCell>
                  <StatusButton status={reclamation.status}>
                    {reclamation.status}
                  </StatusButton>
                </TableCell>
                <TableCell>
                  <select
                    defaultValue={reclamation.status}
                    onChange={(e) => updateReclamationStatus(reclamation.id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </TableCell>
                <TableCell>
                  <ResponseContainer>
                    <ResponseInput
                      type="text"
                      placeholder="Your response"
                      value={responses[reclamation.id] || ''}
                      onChange={(e) => handleResponseChange(reclamation.id, e.target.value)}
                    />
                    <SubmitButton onClick={() => respondToReclamation(reclamation.id)}>
                      Submit
                    </SubmitButton>
                  </ResponseContainer>
                </TableCell>
                <TableCell>
                  <DeleteButton onClick={() => deleteReclamation(reclamation.id)}>
                    <FaTrash />
                  </DeleteButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ReclamationList;
