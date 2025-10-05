import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { userService } from '../../services/api';

function LoginForm({ setResponseData, setError }) {
  const [formData, setFormData] = useState({
    email: '',
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
      const response = await userService.login(formData);
      setResponseData({ action: 'login', data: response.data });
      // In a real app, you'd store the token here
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Login</h3>
      <Form onSubmit={handleSubmit}>
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
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? <><Spinner size="sm" animation="border" /> Logging in...</> : 'Login'}
        </Button>
      </Form>
    </div>
  );
}

export default LoginForm;
