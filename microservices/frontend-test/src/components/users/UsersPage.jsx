import React, { useState } from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import UserList from './UserList';
import UserForm from './UserForm';
import UserDetail from './UserDetail';
import LoginForm from './LoginForm';

function UsersPage() {
  const [activeKey, setActiveKey] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setActiveKey('view');
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setActiveKey('edit');
  };

  return (
    <div>
      <h2>User Service API Testing</h2>
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="list">List Users</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="register">Register</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="login">Login</Nav.Link>
              </Nav.Item>
              {selectedUser && (
                <>
                  <Nav.Item>
                    <Nav.Link eventKey="view">View User</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="edit">Edit User</Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="list">
                <UserList 
                  onViewUser={handleViewUser} 
                  onEditUser={handleEditUser}
                  setResponseData={setResponseData}
                  setError={setError}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="register">
                <UserForm 
                  isRegistration={true}
                  setResponseData={setResponseData}
                  setError={setError}
                  onSuccess={() => setActiveKey('list')}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="login">
                <LoginForm 
                  setResponseData={setResponseData}
                  setError={setError}
                />
              </Tab.Pane>
              {selectedUser && (
                <>
                  <Tab.Pane eventKey="view">
                    <UserDetail 
                      user={selectedUser}
                      onEdit={handleEditUser}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit">
                    <UserForm 
                      user={selectedUser}
                      setResponseData={setResponseData}
                      setError={setError}
                      onSuccess={() => setActiveKey('list')}
                    />
                  </Tab.Pane>
                </>
              )}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {responseData && (
        <div className="mt-4">
          <h4>API Response</h4>
          <div className="response-container">
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 alert alert-danger">
          <h4>Error</h4>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
