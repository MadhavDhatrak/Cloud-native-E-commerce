import React from 'react';
import { Button, Card } from 'react-bootstrap';

function UserDetail({ user, onEdit }) {
  return (
    <div>
      <h3>User Details</h3>
      <Card>
        <Card.Header>
          <h4>{user.name}</h4>
        </Card.Header>
        <Card.Body>
          <p><strong>ID:</strong> {user._id || user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.createdAt && <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>}
          {user.updatedAt && <p><strong>Updated:</strong> {new Date(user.updatedAt).toLocaleString()}</p>}
        </Card.Body>
        <Card.Footer>
          <Button 
            variant="warning"
            onClick={() => onEdit(user)}
          >
            Edit
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default UserDetail;
