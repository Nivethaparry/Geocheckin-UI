import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ChangePassword = () => {
  const [form, setForm] = useState({
    username: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('https://your-backend-api.com/api/change-password', {
        username: form.username,
        newPassword: form.newPassword
      });

      setSuccess(response.data.message || 'Password changed successfully!');
      setForm({ username: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to change password. Please try again.');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', fontFamily: 'sans-serif'}}>
        <h4 className="text-center mb-4">Change Password</h4>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formNewPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="New password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-5" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100 mt-3 mb-5">
            Update Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ChangePassword;
