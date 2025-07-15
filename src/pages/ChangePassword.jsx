import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const ChangePassword = () => {
  const userId = useSelector((state) => state.auth.user?.id); 
  const role = useSelector((state) => state.auth.user?.roleName);
   const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: ''
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

    const { currentPassword, newPassword } = form;

    if (!currentPassword || !newPassword) {
      setError('Both current and new passwords are required.');
      return;
    }

    if (!userId) {
      setError('User not found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7252/api/Auth/ChangePassword', {
        userId,
        currentPassword,
        newPassword
      }, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        }
      });

      toast.success(response.data.message || 'Password changed successfully!');
      navigate('/userdetails');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      if (err.response?.data?.message) {
      toast.error(err.response.data.message);

      } else {
        setError('Failed to change password. Please try again.');
      }
    }
  };

  return (
    <>
    <Container className="d-flex justify-content-center align-items-center mt-4" style={{position:"relative"}}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '20px' , fontFamily: 'sans-serif' }}>
          <span className="d-flex  align-items-start gap-5"><ArrowLeft style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <h4>Change Password</h4></span>
          

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-5 mt-5" controlId="formCurrentPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter current password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-5 mt-5" controlId="formNewPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>
        

          <Button variant="dark" type="submit" className="w-100 mt-5 mb-5 ">
            Update Password
          </Button>
        </Form>
      </div>
    </Container>
     <div style={{ position:"relative" , top:'200px'}}><BottomNav role={role} /></div>
   
    </>
  
  );
};

export default ChangePassword;
