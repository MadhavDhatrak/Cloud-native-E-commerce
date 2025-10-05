import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { userService } from '../../services/api';

function UserForm({ user, isRegistration = false, setResponseData, setError, onSuccess }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setError(null);
      let response;
      
      // Clone the form data to avoid modifying the original state
      const submitData = {...formData};
      
      // If we're updating and password is empty, remove it
      if (!isRegistration && !submitData.password) {
        delete submitData.password;
      }

      if (isRegistration) {
        response = await userService.register(submitData);
        setResponseData({ action: 'register', data: response.data });
      } else if (user) {
        response = await userService.update(user._id || user.id, submitData);
        setResponseData({ action: 'update', data: response.data });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>{isRegistration ? 'Register User' : (user ? 'Edit User' : 'Create User')}</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{user ? 'New Password (leave blank to keep current)' : 'Password'}</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={isRegistration}
          />
        </Form.Group>


        <Button type="submit" disabled={loading}>
          {loading ? 
            <><Spinner size="sm" animation="border" /> {isRegistration ? 'Registering...' : (user ? 'Updating...' : 'Creating...')}</> : 
            (isRegistration ? 'Register' : (user ? 'Update User' : 'Create User'))}
        </Button>
      </Form>
    </div>
  );
}

export default UserForm;
