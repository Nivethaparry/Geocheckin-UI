import React, { useState } from 'react';
import { Form, Button, Container, Card,Alert} from 'react-bootstrap';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword =() => {
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [message, setMessage] = useState(null);  
const [ loading ,setLoading] = useState(false);
const [error, setError] = useState(null);


const navigate = useNavigate();
const location = useLocation();
const email = location.state?.email;

const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
        
      if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (!email) {
      setError('Missing email');
      return;
    }

    setLoading(true);
    
   try {
       const response = await axios.post('https://localhost:7252/api/Auth/ResetPassword', 
        {email, newPassword: password, confirmPassword: confirmPassword});
       console.log("API response:", response.data);
       setMessage('Password reset successfully');

      navigate('/');
     
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
       <Card className="bg-white p-5 p-mt-5 rounded-4 border-0" style={{ width:" 400px" }}>
         <div style={{ maxWidth: '450px'}}>
         <h3 className='text-start mb-5'>Reset Password</h3>
         {message && <Alert variant="success">{message}</Alert>}
         {error && <Alert variant="danger">{error}</Alert>}

      
      <Form onSubmit={handleSubmit}>
          <Form.Group controlId = "password" className='mb-4'>
          <Form.Label className='fw-medium fs-5' >New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>
        </Form.Group>
      
      
      

        <Form.Group className='mb-5'>
          <Form.Label className='fw-medium fs-5'>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

         <Button variant="dark" type="submit" className="w-100 mt-2">
           {loading ? 'Reseting..' : 'Reset password'}
        </Button>
      </Form>
      </div>
      </Card>
    </Container>
  );
}

export default ResetPassword;

