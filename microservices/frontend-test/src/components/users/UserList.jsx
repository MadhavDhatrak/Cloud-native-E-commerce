import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { userService } from '../../services/api';

function UserList({ onViewUser, onEditUser, setResponseData, setError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      setError(null);
      const response = await userService.getAll();
      setUsers(response.data);
      setResponseData({ action: 'list', data: response.data });
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      setError(null);
      const response = await userService.delete(id);
      setResponseData({ action: 'delete', data: response.data });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>User List</h3>
        <Button onClick={fetchUsers} disabled={loading}>
          {loading ? <><Spinner size="sm" animation="border" /> Refreshing...</> : 'Refresh'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading users...</p>
        </div>
      ) : users.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id || user.id}>
                <td>{user._id || user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => onViewUser(user)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2"
                    onClick={() => onEditUser(user)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDeleteUser(user._id || user.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-info">No users found.</div>
      )}
    </div>
  );
}

export default UserList;
